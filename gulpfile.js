// папка готового проекта
let project_folder = "dist";
// папка исходников
let source_folder = "src";

// пути
let path = {
  // готовый проект
  build:{
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/images/",
    fonts: project_folder + "/fonts/",
  },
  // исходники
  src:{
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/main.js",
    img: source_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/",
  },
  // наблюдаем
  watch:{
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",    
  },
  // удаление готового проекта при запуске галпа
  clean: "./" + project_folder + "/",
}

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass');

// функция обновления страницы
function browserSync(){
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false,
  })
}

// обработка html файлов
function html() {
  return src(path.src.html)
    // собрать файлы шаблонизатором
    .pipe(fileinclude())
    // перебрасываем файлы в папку с готовым проектом
    .pipe(dest(path.build.html))
    // обновляем страницу
    .pipe(browsersync.stream())
}

// обработка scss файлов
function css() {
  return src(path.src.css)
    // обработка scss
    .pipe(
      scss({
        outputStyle: "expanded"
      })
    )
    // перебрасываем файлы в папку с готовым проектом
    .pipe(dest(path.build.css))
    // обновляем страницу
    .pipe(browsersync.stream())
}

// слежение за файлами
function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
}

// удаление файлов
function clean()  {
  return del(path.clean);
}

// выполняемые функции
let build = gulp.series(clean, gulp.parallel(css, html));
// функции для слежения
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
