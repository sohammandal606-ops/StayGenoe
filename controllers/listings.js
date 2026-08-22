const Listing = require("../models/listing");
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'openstreetmap'
};

const geocoder = NodeGeocoder(options);

module.exports.index = async (req, res) => {
    const query = req.query.q;
    let allListings;

    if (query) {
        // Search across title, location, and country fields
        allListings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } },
                { country: { $regex: query, $options: 'i' } }
            ]
        });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings, query });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocoder.geocode(req.body.listing.location);
    const newListing = new Listing(req.body.listing);

    if (response.length > 0) {
        newListing.geometry = { type: 'Point', coordinates: [response[0].longitude, response[0].latitude] };
    } else {
        newListing.geometry = { type: 'Point', coordinates: [0, 0] };
    }

    if (req.file) {
        newListing.image = { url: req.file.path, filename: req.file.filename };
    } else if (typeof req.body.listing.image === 'string' && req.body.listing.image) {
        // Fallback if user provides a string URL instead of a file (though form is multipart now)
        // If the form field is 'listing[image]' and it's a file input, req.body.listing.image might be empty or not exist.
        // But if I updated the form to TEXT input for image for a moment?
        // Let's support the object structure.
        // If image is just a string URL entered manually (if we supported that):
        newListing.image = { url: req.body.listing.image, filename: 'default' };
    }

    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // Separate listing body from image if needed, but req.body.listing contains fields
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
