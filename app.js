const express=require("express");
const app =express();
const  mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);

})
app.set("view engine","ejs");
app.set ("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true })); // To handle form data
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('ejs', ejsMate);
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res)=>{
    res.send(" Hi ,I am root");

});
//Index Route
app.get("/listings",async(req,res)=>{
   const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
    });

     //New Route
    app.get("/listings/new",(req,res)=>{
        res.render("listings/new.ejs");
    });

    //Show Route
    app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     res.render("listings/show.ejs", { listing });
    });
 
    //Create Route
    app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

    //Edit Route
    app.get("/listings/:id/edit",async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        res.render("listings/edit.ejs",{ listing});

    });

   //Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});


 //Review
  //Post Review Route
  app.post("/Listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

//Delete Review Route
app.delete(
    "/listings/:id/reviews/:reviewId",
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId} });
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    })
)

    
   

// app.get("/testListing",async(req,res)=>{

//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute , Goa",
//         country:"India",
        
// });
// await sampleListing.save();
// console.log("sample was saved");
// res.send("successful testing");

// });

app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "Page Not Found!"));
});

app.use( (err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",  { message });
    // res.status(statusCode).send(message);
    
});

app.listen(8080,()=>{
    console.log("server is listening to  port 8080");
});
