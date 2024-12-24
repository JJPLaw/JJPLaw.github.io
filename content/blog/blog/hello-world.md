---
title: Hello World! | JJPLaw
heading: Hello World!
description: Welcome to the website! A rambly exploration of how all of this came to be.
layout: blog
tags:
  - draft
date: 2024-12-21
---
## Building a Website

### Beginnings

I decided to start this website after reading about `D3.js` in the Data Visualization* Society magazine "Nightingale". I had just finished my job as a medical writer and wanted to do a fun visualisation project. As a simple place to start, I thought that exploring my personal dataset of album listening would be a great option because I'm fully familiar with the data (and indeed have visualised it previously). 

I plan to cover the development of the visualisation more in a future post, but, briefly, I began with developing the plot in R, where I have a lot of experience with wrangling data and creating complex visualisations with `ggplot`. I wanted the visualisation to be interactive, and the native R options (like Shiny or Plotly) didn't quite suit my needs for this specific visualisation, and having recently read about `D3.js` it seemed like the perfect option. 

With `D3.js` being inherently web-based, and my intention being to undertake further visualisation projects, I thought that having a website to display it all on would be a great resource. 
### Choosing a framework

Once I got the `D3.js` figure up and running on my single test page (after the steep learning curve of understanding `D3.js`, CSS, and HTML), I was faced with structuring up a whole website. 

For a simple site, with only this visualisation page and a home page, I think I would have been up to the task of linking things by hand. But if I wanted multiple projects, a blog with multiple posts, etc, etc, it was going to quickly get out of hand. I also didn't want to use a website builder like Squarespace, or even pay anything at all at this early stage (though I definitely would've been able to find a Squarespace discount code from all of the podcasts I listen to/Youtube videos I watch). 

My first and only thought for hosting the website was to use a Github pages repository, and with their Jekyll static site generator as a starting point for my final searches I landed on using Eleventy as an alternative written in a language I felt better capable of understanding.

### Configuring Eleventy

As jumping off points for learning Eleventy, I used a combination of this [blog post](https://snipcart.com/blog/11ty-tutorial), and the Eleventy docs

<small>*It's an American society, though as a Brit I'll be using an 's' rather than a zed.</small>