// папка готового проекта
let project_folder = 'dist';
// папка исходников
let source_folder = 'src';

//! пути
let path = {
  // готовый проект
  build:{
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/images/',
    fonts: project_folder + '/fonts/',
  },
  // исходники
  src:{
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
    css: source_folder + '/scss/style.scss',
    js: source_folder + '/js/main.js',
    img: source_folder + '/images/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: source_folder + '/fonts/',
  },
  // наблюдаем
  watch:{
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/images/**/*.{jpg,png,svg,gif,ico,webp}',    
  },
  // удаление готового проекта при запуске галпа
  clean: './' + project_folder + '/',
}

//! переменные
let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default;

//! обновление страницы
function browserSync(){
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/'
    },
    port: 3000,
    notify: false,
  })
}

//! обработка html файлов
function html() {
  return src(path.src.html)
    // собрать файлы шаблонизатором
    .pipe(fileinclude())
    // перебрасываем файлы в папку с готовым проектом
    .pipe(dest(path.build.html))
    // обновляем страницу
    .pipe(browsersync.stream())
}

//! обработка scss файлов
function css() {
  return src(path.src.css)
    // обработка scss
    .pipe(
      scss({
        outputStyle: 'expanded'
      })
    )
    // группировка медиа запросов в один блок
    .pipe(group_media())
    // автопрефиксер
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 8 versions'],
        cascade: true
      })
    )
    // перерасываем обработанный файл не сжатым в папку с готовым проектом
    // цель получить второй не сжатый файл для удобства чтения заказчиком
    .pipe(dest(path.build.css))
    // очистка (?) и сжатие css
    .pipe(clean_css())
    //переименование файла в min 
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    // перебрасываем файл в папку с готовым проектом
    .pipe(dest(path.build.css))
    // обновляем страницу
    .pipe(browsersync.stream())
}

//! обработка js файлов
function js() {
  return src(path.src.js)
    // собрать файлы шаблонизатором
    .pipe(fileinclude())
    // перерасываем обработанный файл не сжатым в папку с готовым проектом
    // цель получить второй не сжатый файл для удобства чтения заказчиком
    .pipe(dest(path.build.js))
    //переименование файла в min 
    .pipe(
      rename({
        extname: '.min.js'
      })
    )    
    // перебрасываем файлы в папку с готовым проектом
    .pipe(dest(path.build.js))
    // обновляем страницу
    .pipe(browsersync.stream())
}

//! слежение за файлами
function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
}

//! удаление файлов
function clean()  {
  return del(path.clean);
}

//! выполняемые функции
let build = gulp.series(clean, gulp.parallel(js, css, html));
//! функции для слежения
let watch = gulp.parallel(build, watchFiles, browserSync);

// ! 
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
