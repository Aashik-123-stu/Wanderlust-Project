const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    // URL se category ko fetch
    let category = req.query.category;
    let allListings;

    if (category) {
        // if category exist match with database
        allListings = await Listing.find({ category: category });
        
        // throw alert if not listing found on categary
        if (allListings.length === 0) {
            req.flash("error", `No listings found for ${category}`);
            return res.redirect("/listings");
        }
    } else {
        // by deafult all listings shows
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");;
}

module.exports.showListings = async(req,res)=>{
    let {id} = req.params;
     const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
     if(!listing){
         req.flash("error","Listing you requested for  does not exist!");
         return res.redirect("/listings");
     }
     console.log(listing)
     res.render("listings/show.ejs",{listing});
}

module.exports.createListings = async (req, res, next) => {
    // File ka data nikala
    let url = req.file.path;
    let filename = req.file.filename;

    // Listing create
    const newListing = new Listing(req.body.listing);

    // User aur Image set kiya (Explicitly)
    newListing.owner = req.user._id;
    newListing.image = { url, filename }; 

    // Save kiya
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditform = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
         req.flash("error","Listing you requested for  does not exist!");
         return res.redirect("/listings");
     }

     let originalImageUrl = listing.image.url;
     originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200");   // set image parameter in edit page
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
     
   let { id } = req.params;
   let updateData = req.body.listing;

    // 2. Agar image field hai, to usse sahi object banayein, firstly
    if (updateData.image) {
        updateData.image = {
            url: updateData.image,
            filename: 'listingimage'
        };
    }
    let listing = await Listing.findByIdAndUpdate(id, updateData);
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename}
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);

}

module.exports.destroyListing = async(req,res)=>{
   let {id} = req.params;
   let deletedlisting = await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
    req.flash("success","listing Deleted !");
   res.redirect('/listings');
}

// Search Listings Controller
module.exports.searchListings = async (req, res) => {        
    let { q } = req.query;

    if (!q || q.trim() === "") {
        return res.redirect("/listings");
    }
    // case-insensitive Yani 'del' likhne par 'Delhi' bhi mil jayega
    const searchRegex = new RegExp(q.trim(), 'i'); 

    // Title, Location, ya Country mein match dhoondhein
    const allListings = await Listing.find({
        $or: [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex }
        ]
    });

    if (allListings.length === 0) {
        req.flash("error", "No listings found for your search.");
        return res.redirect("/listings");
    }
    // reuse index.ejs to see results
    res.render("listings/index.ejs", { allListings });
};