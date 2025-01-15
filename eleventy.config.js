import { deleteSync } from "del";
import { DateTime } from "luxon";
import Uglify from "uglify-js";
import CleanCSS from "clean-css";

export default async function (eleventyConfig) {  
    // Clean out the website output folder
    // const dirToClean = '../JJPLaw.github.io/*';
    const dirToClean = '_site/*';
    deleteSync(dirToClean, { force: true });
    

    eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
        // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
        return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "d LLLL yyyy");
    });

    eleventyConfig.addFilter("verboseDate", (dateObj) => {
        let day = DateTime.fromJSDate(dateObj, { zone: "utc" }).toLocaleString({ day: 'numeric' });
        let sup;
        if (day === '1' || day === '21' || day === '31') {
            sup = "st"
        } else if (day === '2' || day === '22') {
            sup = "nd"
        } else if (day === '3' || day === '23') {
            sup = "rd"
        } else sup = "th";
        let wDay = DateTime.fromJSDate(dateObj, { zone: "utc" }).toLocaleString({ weekday: 'long'});
        let half2 = DateTime.fromJSDate(dateObj, { zone: "utc" }).toLocaleString({ month: 'long', year: 'numeric' });
        let str = `${wDay}, ${day}<sup>${sup}</sup> ${half2}`;
        return str;
    });

    eleventyConfig.addFilter("htmlDateString", (dateObj) => {
        // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
        return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
    });

    eleventyConfig.addPassthroughCopy('.nojekyll');
    eleventyConfig.addPassthroughCopy('CNAME');
    eleventyConfig.addPassthroughCopy("content/projects/**/*.json");
    eleventyConfig.addPassthroughCopy('favicon/*');
    eleventyConfig.addPassthroughCopy({
        "content/projects/first-listens/artwork/*": "assets/artwork/",
        "content/blog/images/**/*.png" : "assets/blog-images/"
     });

    eleventyConfig.addBundle("css", {
        toFileDirectory: "dist",
        // transforms: [async function (content) { 
        //     return new CleanCSS({}).minify(content).styles;
        // }]
    });
    
    eleventyConfig.addBundle("js", {
        toFileDirectory: "dist",
        transforms: [async function (content) {
            return Uglify.minify(content).code;
        }]
    });

    return {
        dir: {
            input: 'content',
            includes: '../_includes',
            data: '../_data',
            output: '_site'
        }
    };
};