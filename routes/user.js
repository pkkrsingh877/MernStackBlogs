const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Article = require("../models/articles");
const Question = require("../models/questions");
const prepareSomeTags = require('../functions/prepareSomeTags');

router.delete('/comments/delete', async (req, res) => {
	try {
		const { questionId, commentId } = req.body;
		const question = await Question.findByIdAndUpdate(questionId, {
			$pull: { comments: { _id: commentId } }
		}, {
			new: true
		});
		console.log(question);
		res.status(200).redirect(`/questions/${questionId}`);
	} catch (err) {
		console.log(err);
		res.status(400).render('error');
	}
});

router.patch('/comments/edit', (req, res) => {
	try {
		const { questionId, commentId } = req.body;
		// const question = await Question.findByIdAndUpdate(questionId, {
		// 	$pull: { comments: { _id: commentId } }
		// }, {
		// 	new: true
		// });
		// console.log(question);
		res.status(200).redirect(`/questions/${questionId}`);
	} catch (err) {
		console.log(err);
		res.status(400).render('error');
	}
});

router.get('/applying', async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(res.locals.user._id, {
			hasAppliedToBeEditor: true
		}, {
			new: true
		});
		console.log(user);
		res.redirect('/');
	} catch (err) {
		res.status(400).render("error");
	}
});

router.delete('/questions/delete/:id', async (req, res) => {
	try{
		const { id } = req.params;
		await Question.findByIdAndDelete(id);
		res.status(200).redirect('/user/questions');
	}catch(err){
		console.log(err);
		res.status(400).render('error');
	}
});

router.patch('/questions/edit/:id', async (req, res) => {
	try{
		const { id } = req.params;
		const { title, description, tags } = req.body;
		console.log(id, req.body)
		const question = await Question.findByIdAndUpdate(id, {
			title: title,
			description: description.trim(),
			tags: prepareSomeTags(tags)
		}, {
			new: true
		});
		console.log(question);
		res.status(200).redirect('/user/questions');
	}catch(err){
		console.log(err);
		res.status(400).render('error');
	}
});

router.get('/questions/edit/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const question = await Question.findById(id);
		res.render('user/editQuestion', { question });
	} catch (err) {
		console.log(err);
		res.status(400).render('error');
	}
});

router.get('/questions', async (req, res) => {
	try {
		const user = await User.findById(res.locals.user._id).populate('questions');
		const questions = user.questions;
		res.render('user/questions', { questions });
	} catch (err) {
		console.log(err);
		res.status(400).render('error');
	}
});

router.delete("/savedarticles", async (req, res) => {
	try {
		const { id } = req.body;
		const data = await User.findByIdAndUpdate(
			res.locals.user._id,
			{
				$pull: { saved: id },
			},
			{ new: true }
		);
		res.status(200).redirect("/user/savedarticles");
	} catch (err) {
		console.log(err);
		res.status(400).end();
	}
});

router.get("/savedarticles", async (req, res) => {
	let { page, skip, limit } = req.query;
	limit = parseInt(limit);
	page = parseInt(page);
	skip = parseInt(skip);
	if (!page || page < 0) {
		page = 1;
	}
	if (!skip || skip < 0) {
		skip = 4;
	}
	if (!limit || limit < 0) {
		limit = 4;
	}
	const currentPage = parseInt(page);
	let temp = currentPage;
	if (temp != 1) {
		temp--;
	}
	try {
		const count = res.locals.user.saved.length;
		const totalPages = Math.ceil(count / limit);
		if (page > totalPages) {
			temp = totalPages - 1;
			page = totalPages;
		}

		const user = await User.findById(res.locals.user._id).populate('saved');
		let savedArticles = user.saved;
		const skipAndLimit = (page, skip) => {
			//for skipping
			savedArticles = savedArticles.slice(
				(page - 1) * skip,
				(page - 1) * skip + 4
			);
			//for limiting
			savedArticles = savedArticles.slice(0, 4);
		};

		skipAndLimit(page, skip);

		res.status(200).render("user/savedArticles", {
			savedArticles,
			totalPages,
			currentPage,
			temp,
		});
	} catch (err) {
		console.log(err);
		res.status(404).render("error");
	}
});

router.post("/save", async (req, res) => {
	try {
		const { id } = req.body;
		if (res.locals.user) {
			const user = await User.findByIdAndUpdate(
				res.locals.user._id,
				{
					$addToSet: { saved: id },
				},
				{
					new: true,
					upsert: true,
				}
			);
		}
		res.status(200).redirect('/articles');
	} catch (err) {
		console.log(err);
		res.status(400).render('error');
	}
});

router.post("/update", async (req, res) => {
	try {
		if (res.locals.user.id) {
			const { name, username, email, img, bio } = req.body;
			const user = await User.findByIdAndUpdate(
				res.locals.user.id,
				{ name, username, email, img, bio },
				{ new: true }
			);
			res.status(200).json({ user: user._id });
		} else {
			res.status(200).redirect("/auth/login");
		}
	} catch (err) {
		console.log(err);
	}
});

router.get("/update", async (req, res) => {
	res.render("user/updateProfile.ejs");
});

router.get("/profile", async (req, res) => {
	try {
		const data = await User.findById(res.locals.user.id);
		res.status(200).render("user/profile", { data });
	} catch (err) {
		res.status(404).render("error");
	}
});

module.exports = router;
