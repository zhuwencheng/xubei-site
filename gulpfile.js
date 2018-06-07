var gulp = require('gulp');
var less = require('gulp-less');                // less编译
var cssmin = require("gulp-minify-css");        // css压缩
var notify = require('gulp-notify');            // 错误提示
var plumber = require('gulp-plumber');          // 出现异常不终止监听
var uglify = require('gulp-uglify');            // js压缩
var minifyHtml = require("gulp-minify-html");   // html压缩
var concat = require('gulp-concat');            // 文件合并
var browsersync = require('browser-sync').create();  // 获取browsersync,自动刷新
var del = require('del');                       // 删除dist目录下文件
var imgmin = require('gulp-imagemin');          // 图片压缩
var autoprefixer = require('gulp-autoprefixer');// 自动添加浏览器前缀

// 删除dist目录下的所以文件
gulp.task('clean', function (cb) {
    return del(['dist/*'], cb);
})

// 自定义任务名称
gulp.task('testless', function () {
    gulp.src('src/css/**/*.less')        // 该任务针对的文件
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')})) // 会在gulp控制台打印错误信息
        .pipe(autoprefixer())
        .pipe(less())                   // 改任务调用的模块
        .pipe(cssmin())                 // 调用css压缩模块
        // .pipe(concat('all.css'))     // 合并文件
        .pipe(gulp.dest('dist/css'))    // 处理后文件的保存地址
        .pipe(browsersync.stream());    // 文件有更新自动执行
})

// js压缩
gulp.task('testjs', function () {
    gulp.src('src/js/**/*.js')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')})) // 会在gulp控制台打印错误信息
        // .pipe(uglify())                 // js压缩
        .pipe(gulp.dest('dist/js'))
        .pipe(browsersync.stream());    // 文件有更新自动执行
})

// 图片压缩
gulp.task('image', function () {
    gulp.src("src/images/*.{png,jpg,jpeg,gif.ico}")//gulp.src("src/images/**/*.{png,jpg,jpeg,gif.ico}")
        .pipe(imgmin())
        .pipe(gulp.dest('dist/images'))
        .pipe(browsersync.stream());    // 文件有更新自动执行
})
gulp.task('imageL', function () {
    gulp.src("src/images/actImages/*")//gulp.src("src/images/**/*.{png,jpg,jpeg,gif.ico}")
        .pipe(imgmin())
        .pipe(gulp.dest('dist/images/actImages'))
        .pipe(browsersync.stream());    // 文件有更新自动执行
})

// 拷贝第三方插件
gulp.task("lib", function () {
    gulp.src("src/js/lib/**/*.*")
        .pipe(gulp.dest("dist/js/lib"))
})

// html压缩
gulp.task('minify-html', function () {
    gulp.src('src/**/*.html')           // 要压缩的html文件
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')})) // 会在gulp控制台打印错误信息
        .pipe(minifyHtml())             // 压缩
        .pipe(gulp.dest('dist'))
        .pipe(browsersync.stream());    // 文件有更新自动执行
});

// 监听文件,自动刷新
gulp.task('serve', ['clean'], function () {
    // 对应需要监听的方法(重要)
    gulp.start('testjs', 'minify-html', 'testless', 'image', 'imageL','lib');
    browsersync.init({
        port: 2016,
        server: {
            baseDir: ['dist']
        }
    });

    gulp.watch('src/js/**/*.js', ['testjs'])       // 当指定的less文件发生改变时（参数一），调用指定模块（参数二）
    gulp.watch('src/images/**/*.*', ['image','imageL'])
    gulp.watch('src/**/*.html', ['minify-html'])
    gulp.watch('src/css/**/*.less', ['testless'])
});

// 运行gulp后会默认执行default中的所有任务
gulp.task('default', ['serve']);