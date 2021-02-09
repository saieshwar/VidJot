const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea get index page
router.get('/', (req,res) =>{ 
    Idea.find({user : req.user.id}).lean().
    sort({date:'desc'}).then(ideas => {
        
        res.render('ideas/index', {
            
            ideas: ideas
        })
    })
    
   
    
})
//Add Idea Form
router.get('/add' , (req,res) => {
    res.render('ideas/add');
})
///edit Idea Form
router.get('/edit/:id' , (req,res) => {
    Idea.findOne({
        _id: req.params.id
    }).lean()
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        }else {
        res.render('ideas/edit', {
            idea: idea
        })
    }
    })
})

//Process form

router.post('/', (req,res) => {

    let errors = [];
    if(!req.body.title) {
        errors.push({ text : 'Please add a title'});
    }
    if(!req.body.details) {
        errors.push({ text : 'Please add a details for the title'});
    }
    if(errors.length>0) {
        res.render('ideas/add',{ 
        errors: errors,
        title: req.body.title,
        details: req.body.details                           
        });
    }
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser).save()
        .then(idea => {
            req.flash('success_msg', 'Video Idea Added')
            res.redirect('/ideas');
        })
    }
   console.log(req.body);
   
})

//Edit Form process
router.put('/:id', (req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
       
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then(idea => {
            req.flash('success_msg', 'Video Idea Updated')
            res.redirect('/ideas')
        })
    })
    
})

//Delete Idea

router.delete('/:id', (req,res) =>{
    Idea.remove({_id: req.params.id})
    .then(() =>{
        req.flash('success_msg', 'Video Idea Removed')
        res.redirect('/ideas')
    })
 
})

module.exports = router;