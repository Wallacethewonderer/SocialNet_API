const { User, Thought } = require('../models');

module.exports = {

    // get all users
    getAllUsers(req, res) {
        User.find({})
            .then(userData => res.json(userData))
            .catch(err => res.status(500).json(err));
    },

    // get a user by id
    getUserById(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate("thoughts friends")
            .select('-__v')
            .then(userData => {
            
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(userData);
            }
            )
            .catch(err => res.status(500).json(err));
    },

    // create a user
    createUser(req, res) {
        User.create(req.body)
            .then(userData => res.json(userData))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
              });
    },

    // update a user by id
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(userData);
            }
            )
            .catch(err => res.status(500).json(err));
    },

    // delete a user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                } else {
                    Thought.deleteMany({ _id: { $in: userData.thoughts } })
                        .then(() => {
                            res.json({ message: 'User and associated thoughts deleted!' });
                        }
                        )
                        .catch(err => res.status(500).json(err));
                }
            })
            .catch(err => res.status(500).json(err));
    },

    // add a friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(userData);
            }
            )
            .catch(err => res.status(500).json(err));
    },

    // remove a friend
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
            .then(userData => {
                // If no user is found, send 404
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(userData);
            }
            )
            .catch(err => res.status(500).json(err));
    }
};


