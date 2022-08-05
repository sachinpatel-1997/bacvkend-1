let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    uuidv4 = require('uuid/v4'),
    router = express.Router();
const DIR = '/home/tops/Reactjs Project/node-express-boilerplate/public/';
const userController = require('../../controllers/user.controller');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
// User model
let User = require('../../models/user.model');
router.post('/user-profile', upload.single('profileImg'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        profileImg: url + '/home/tops/Reactjs Project/node-express-boilerplate/public/' + req.file.filename
    });
    user.save().then(result => {
        res.status(201).json({
            message: "User registered successfully!",
            userCreated: {
                _id: result._id,
                name: result.name,
                email: result.email,
                password: result.password,
                profileImg: result.profileImg
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})
router.get('/user-profile/edit/:userId', upload.single('profileImg'), validate(userValidation.getUser), (userController.getUser),(req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        profileImg: url + '/home/tops/Reactjs Project/node-express-boilerplate/public/' + req.file.filename
    });
    user.save().then(result => {
        res.status(201).json({
            message: "User Updated successfully!",
            userCreated: {
                _id: result._id,
                name: result.name,
                email: result.email,
                password: result.password,
                profileImg: result.profileImg
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})
// router.patch('/user-profile/upadte/:userId', upload.single('profileImg') ,(userController.updateUser),(req, res, next) => {
//     const url = req.protocol + '://' + req.get('host')
//     const user = new User({
//         _id: new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         email: req.body.email,
//         // password: req.body.password,
//         profileImg: url + '/home/tops/Reactjs Project/node-express-boilerplate/public/' + req.file.filename
//     });
//     user.save().then(result => {
//         res.status(201).json({
//             message: "User registered successfully!",
//             userCreated: {
//                 _id: result._id,
//                 name: result.name,
//                 email: result.email,
//                 // password: result.password,
//                 profileImg: result.profileImg
//             }
//         })
//     }).catch(err => {
//         console.log(err),
//             res.status(500).json({
//                 error: err
//             });
//     })
// })


router.patch('/user-profile/upadte/:id',upload.single('profileImg'),async (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    try {
       
        const user = await User.findByIdAndUpdate(
           mongoose.Types.ObjectId(req.params.id),
           { 
            name: req.body.name,
          email: req.body.email, 
            profileImg: url + '/home/tops/Reactjs Project/node-express-boilerplate/public/' + req.file.filename 
        }
        );
        return res.status(201).send({user})
    
    } catch(e) {
        return res.status(500).json({message:e.message,status:"Failed"})
    }
    
    })
// router.get("/", (req, res, next) => {
//     User.find().then(data => {
//         res.status(200).json({
//             message: "User list retrieved successfully!",
//             users: data
//         });
//     });
// });
module.exports = router;