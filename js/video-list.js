async function loadVideos() {
  const container = document.getElementById('video-container');

  try {
    const response = await fetch('./data/videos.json');
    const videos = await response.json();

    videos.forEach((video) => {
      const card = document.createElement('div');
      card.className = 'bg-white shadow rounded-xl overflow-hidden transition hover:shadow-lg';

      card.innerHTML = `
        <iframe src="${video.url}" class="w-full aspect-video" allowfullscreen></iframe>
        <div class="p-4 bg-gray-100">
          <h3 class="font-semibold text-lg text-gray-700">${video.title}</h3>
          <p class="text-sm text-gray-600">${video.grade}・${video.subject}</p>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<p class="text-center text-red-600">動画リストの読み込みに失敗しました。</p>`;
    console.error(err);
  }
}

loadVideos();
