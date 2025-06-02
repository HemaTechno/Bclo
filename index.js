<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="موقع لرفع وتحميل الملفات والسكربتات بسهولة وسرعة.">
  <title>الرئيسية - مركز الملفات</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
  <style>
    body {
      font-family: 'Cairo', sans-serif;
    }
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-50 to-white text-gray-800 min-h-screen flex flex-col">

  <!-- Header -->
  <header class="bg-white shadow-md p-4 sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold text-blue-700">📁 مركز الملفات</h1>
      <nav class="space-x-4 space-x-reverse">
        <a href="index.html" class="text-blue-600 font-semibold hover:underline">الرئيسية</a>
        <a href="files.html" class="hover:text-blue-600">الملفات</a>
        <a href="scripts.html" class="hover:text-blue-600">السكربتات</a>
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="flex-1 flex flex-col items-center justify-center text-center py-16 px-4">
    <lottie-player src="https://assets4.lottiefiles.com/packages/lf20_jcikwtux.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></lottie-player>
    <h2 class="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">مرحبًا بك في مركز الملفات</h2>
    <p class="text-lg text-gray-600 mb-6 animate-fade-in delay-200">منصة موثوقة وآمنة لرفع ومشاركة الملفات بسهولة وسرعة.</p>
    <a href="#upload" class="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-105 animate-fade-in delay-500">⬆️ ارفع ملفك الآن</a>
  </section>

  <!-- Features -->
  <section class="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
      <h3 class="text-2xl font-semibold mb-2 text-blue-700">📄 الملفات</h3>
      <p class="text-gray-600 mb-4">استعرض الملفات التي تم رفعها من قبل المستخدمين بسهولة.</p>
      <a href="files.html" class="text-blue-600 font-medium hover:underline">تصفح الملفات →</a>
    </div>
    <div class="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
      <h3 class="text-2xl font-semibold mb-2 text-blue-700">🧠 السكربتات</h3>
      <p class="text-gray-600 mb-4">مجموعة مميزة من السكربتات المجربة والآمنة.</p>
      <a href="scripts.html" class="text-blue-600 font-medium hover:underline">عرض السكربتات →</a>
    </div>
    <div class="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
      <h3 class="text-2xl font-semibold mb-2 text-blue-700">⬆️ رفع الملفات</h3>
      <p class="text-gray-600 mb-4">ارفع ملفاتك في خطوات بسيطة وبشكل آمن.</p>
      <a href="#upload" class="text-blue-600 font-medium hover:underline">رفع ملف →</a>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-white mt-12 p-4 text-center text-sm text-gray-500 shadow-inner">
    &copy; 2025 مركز الملفات. جميع الحقوق محفوظة.
  </footer>

  <script>
    document.querySelectorAll('.animate-fade-in').forEach((el, index) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, 300 + index * 200);
    });
  </script>
</body>
</html>
