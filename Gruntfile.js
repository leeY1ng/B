module.exports = function(grunt) {

    // grunt.initConfig({
    //     uglify: {
    //         my_target: {
    //             files: {
    //                 '_/js/script.js': ['_/components/js/*.js']
    //             } //files
    //         } //myTarget
    //     }, //uglify
    //     compass: {
    //         dev: {
    //             options: {
    //                 config: 'config.rb'
    //             } //options
    //         } //dev
    //     }, //compass
    //     watch: {
    //         options: {
    //             livereload: true
    //         },
    //         scripts: {
    //             files: ['_/components/js/*.js'],
    //             tasks: ['uglify']
    //         }, //scripts     
    //         html: {
    //             files: ['*.html']
    //         }, //html
    //         sass: {
    //             files: ['_/components/sass/*.scss'],
    //             tasks: ['compass:dev']
    //         } //sass  
    //     } //watch
    // }); 

    // ["grunt-less"].forEach(function(task){
    //     grunt.loadNpmTasks(task);
    // });

    grunt.initConfig({
        less:{
            development:{
                files:{
                    "public/css/main.css":"less/main.less",
                    "public/css/cart.css" : "less/cart.less"
                }
            }
        },
        uglify:{
            all:{
                files:{
                    "public/js/meadowlark.min.js" :["public/js/**/*.js"]
                }
            }
        },
        cssmin:{
            combine:{
                files:{
                    "public/css/meadowlark.css": ["public/css/**/*.css","public/css/meadowlark*.css"]

                }
            },
            minify:{
                src: "public/css/meadowlark.css",
                dest: "public/css/meadowlark.min.css"
            }
        },
        hashres:{
            options:{
                fileNameFormate: "${name}.${hash}.${ext}"
            },
            all:{
                src: [
                    "public/js/meadowlark.min.js",
                    "public/css/meadowlark.min.css"
                ],
                dest:[
                    // "views/layouts/main.handlebars"
                    "config.js"
                ]
            }
        },
        lint_pattern: {
            view_statics: {
                options: {
                    rules: [
                        {
                            pattern: /<link [^>]*href=["'](?!\{\{static )>/,
                            message: "Un-mapped static resourece found in <link>"
                        },
                        {
                            pattern: /<script> [^>]*src=["'](?!\{\{static )/,
                            message: 'Un-mapped static found in <script>'
                        }
                    ]
                }
            }
        }
    });
    //initConfig
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-hashres");


    // grunt.registerTask('default', ['less']);
    grunt.registerTask("static",["less","cssmin","uglify","hashres"]);
} //exports
