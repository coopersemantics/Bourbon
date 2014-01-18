module.exports = function(grunt) {

    "use strict";

    var fs = require("fs");
    var gzip = require("gzip-js");
    var testTasks = ["jshint", "connect:server", "jasmine"];
    var jsFiles = [
        "src/core/var.js",
        "src/core/init.js",
        "src/core/util.js",
        "src/dom/selector.js",
        "src/dom/event.js",
        "src/lang/function.js",
        "src/lang/object.js",
        "src/lang/array.js",
        "src/lang/string.js",
        "src/emitter/emit.js"
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        connect: {
            client: {
                options: {
                    base: ".",
                    port: 8000,
                    keepalive: true
                }
            },
            server: {
                options: {
                    base: ".",
                    port: 8001                }
            }
        },

        concat: {
            dist: {
                src: ["src/intro.js"].concat(jsFiles).concat(["src/outro.js"]),
                dest: "dist/bourbon.js"
            },
            options: {
                banner: fs.readFileSync("src/copyright.js", "utf8"),
                process: true
            }
        },

        uglify: {
            all: {
                files: {
                    "dist/bourbon.min.js": ["dist/bourbon.js"]
                },
                options: {
                    banner: "/*! Bourbon.js v<%= pkg.version %> " +
                            "| (c) <%= grunt.template.today('yyyy') %>, coopersemantics " +
                            "| MIT license " +
                            "| <%= grunt.template.today('yyyy-mm-dd') %> */;",
                    sourceMap: "dist/bourbon.min.map",
                    sourceMappingURL: "bourbon.min.map",
                    sourceMapPrefix: 1,
                    beautify: {
                        ascii_only : true
                    },
                    mangle: true
                }
            }
        },

        compare_size: {
            files: ["dist/bourbon.js", "dist/bourbon.min.js"],
            options: {
                compress: {
                    gz: function(contents) {
                        return gzip.zip(contents, {}).length;
                    }
                }
            }
        },

        jshint: {
            all: {
                src: ["Gruntfile.js", "test/spec/*.js"],
                options: {
                    jshintrc: true
                }
            },
            dist: {
                src: "dist/bourbon.js",
                jshintrc: grunt.file.readJSON("src/.jshintrc")
            }
        },

        jasmine: {
            src: jsFiles,
            options: {
                specs: "test/spec/*spec.js"
            }
        },

        "saucelabs-jasmine": {
            all: {
                options: {
                    urls: ["http://127.0.0.1:8001/test/SpecRunner.html"],
                    testTimeout: 300000,
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3,
                    browsers : [
                        {
                            browserName : "firefox",
                            platform : "Windows 8.1"
                        },
                        {
                            browserName : "firefox",
                            platform : "Linux"
                        },
                        {
                            browserName: "chrome",
                            platform: "Windows 8.1"
                        },
                        {
                            browserName: "chrome",
                            platform: "Linux"
                        },
                        {
                            browserName: "chrome",
                            platform: "OS X 10.9"
                        },
                        {
                            browserName: "safari",
                            platform: "OS X 10.8"
                        },
                        {
                            browserName: "iphone",
                            platform: "OS X 10.8"
                        },
                        {
                            browserName: "internet explorer",
                            platform: "Windows 8",
                            version: "10"
                        },
                        {
                            browserName: "internet explorer",
                            platform: "Windows 8.1",
                            version: "11"
                        },
                        {
                            browserName: "internet explorer",
                            platform: "Windows 7",
                            version: "9"
                        },
                        {
                            browserName: "internet explorer",
                            platform: "Windows XP",
                            version: "8"
                        }
                    ]
                }
            }
        },

        watch: {
            files: ["Gruntfile.js", "src/*.js", "src/**/*.js", "/test/spec/*.js", "test/*.html"],
            tasks: "dev"
        }
    });

    if (process.env.SAUCE_ACCESS_KEY) {
        testTasks.push("saucelabs-jasmine");
    }

    /**
     * Load Npm Tasks
     */

    grunt.loadNpmTasks("grunt-compare-size");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-saucelabs");
    grunt.loadNpmTasks("grunt-contrib-watch");

    /**
     * Register Tasks
     */

    grunt.registerTask("default", ["concat", "uglify", "compare_size"].concat(testTasks));
    grunt.registerTask("dev", "default");
    grunt.registerTask("keepAlive", ["connect:client"]);
    grunt.registerTask("lint", ["concat", "jshint"]);
    grunt.registerTask("test", testTasks);
    grunt.registerTask("travis", "default");
    grunt.registerTask("unitTest", "jasmine");
};
