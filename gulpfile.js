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
    html: source_folder + "/*.html",
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
    fileinclude = require('gulp-file-include');

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

// слежение за файлами
function watchFiles() {
  gulp.watch([path.watch.html], html)
}

let build = gulp.series(html);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
