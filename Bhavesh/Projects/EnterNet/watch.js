document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Movie Database (Copied for Static Scope)
    // ==========================================
    const moviesDatabase = [
        {
            id: 'neon-genesis',
            title: 'NEON GENESIS',
            description: 'In 2077, the line between humanity and technology blurs. Choose your path in this interactive thriller where every decision changes the ending.',
            genre: ['Sci-Fi', 'Action', 'Cyberpunk'],
            rating: '98% Match',
            year: 2026,
            duration: '2h 10m',
            type: 'movie',
            backdrop: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=1200&auto=format&fit=crop',
            poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
            videoUrl: 'sample-30s.mp4',
            cast: 'Bhavesh Sharma, Ava Lovelace, John Connor',
            tags: 'Cyberpunk, Atmospheric, Mind-bending'
        },
        {
            id: 'kgf-2',
            title: 'KGF Chapter 2',
            description: 'In the blood-soaked Kolar Gold Fields, Rocky\'s name strikes fear in his foes. While his allies look up to him, the government sees him as a threat to law and order.',
            genre: ['Action', 'Crime', 'Drama'],
            rating: '96% Match',
            year: 2022,
            duration: '2h 48m',
            type: 'movie',
            backdrop: 'b.jpg',
            poster: 'b.jpg',
            videoUrl: 'sample-30s.mp4',
            cast: 'Yash, Sanjay Dutt, Raveena Tandon',
            tags: 'Action-Packed, Intense, Explosive'
        },
        {
            id: 'kgf-3',
            title: 'KGF Chapter 3',
            description: 'The saga continues as Rocky expands his gold mining empire globally, facing off against international mafias and defense forces.',
            genre: ['Action', 'Thriller', 'Crime'],
            rating: '95% Match',
            year: 2025,
            duration: '2h 35m',
            type: 'movie',
            backdrop: 'l.jpg',
            poster: 'l.jpg',
            videoUrl: 'sample-30s.mp4',
            cast: 'Yash, Srinidhi Shetty, Prithviraj',
            tags: 'Empire, Gritty, Action'
        },
        {
            id: 'kgf-4',
            title: 'KGF Chapter 4',
            description: 'Rocky must defend his territory from internal rebellions and a new high-tech military threat. The end of an era looms.',
            genre: ['Action', 'Drama', 'War'],
            rating: '92% Match',
            year: 2026,
            duration: '2h 40m',
            type: 'movie',
            backdrop: 'y.jpg',
            poster: 'y.jpg',
            videoUrl: 'sample-30s.mp4',
            cast: 'Yash, Prakash Raj, Anant Nag',
            tags: 'Dramatic, Epic, Explosive'
        },
        {
            id: 'kgf-5',
            title: 'KGF Chapter 5: Resurrection',
            description: 'Thought to be lost at sea, Rocky resurfaces in a new country, building a secret empire to reclaim the gold fields once and for all.',
            genre: ['Action', 'Suspense', 'Adventure'],
            rating: '99% Match',
            year: 2027,
            duration: '2h 50m',
            type: 'movie',
            backdrop: 't.jpg',
            poster: 't.jpg',
            videoUrl: 'sample-30s.mp4',
            cast: 'Yash, Prabhas, Deepika Padukone',
            tags: 'Spectacular, Epic, Reborn'
        },
        {
            id: 'sintel',
            title: 'Sintel: The Dragon Quest',
            description: 'A lonely young woman searches desperately for her dragon companion, traveling across breathtaking snowy peaks and desolate deserts.',
            genre: ['Animation', 'Fantasy', 'Adventure'],
            rating: '91% Match',
            year: 2010,
            duration: '15m',
            type: 'series',
            backdrop: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
            poster: 'movies1.jpg',
            videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
            cast: 'Halina Reijn, Thom Hoffman',
            tags: 'Emotional, Beautiful, Fantasy'
        },
        {
            id: 'big-buck-bunny',
            title: 'Big Buck Bunny',
            description: 'A gigantic, giant rabbit decides to take revenge on three mischievous rodents who bullied him and destroyed his favorite forest flowers.',
            genre: ['Animation', 'Comedy', 'Family'],
            rating: '89% Match',
            year: 2008,
            duration: '10m',
            type: 'series',
            backdrop: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=1200&auto=format&fit=crop',
            poster: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            cast: 'Bunny, Rodents',
            tags: 'Funny, slapstick, lighthearted'
        },
        {
            id: 'tears-of-steel',
            title: 'Tears of Steel',
            description: 'Set in a dystopian future Amsterdam, a group of scientists attempts to rescue the world from destructive giant flying robots using time-travel.',
            genre: ['Sci-Fi', 'Action', 'Indie'],
            rating: '94% Match',
            year: 2012,
            duration: '12m',
            type: 'movie',
            backdrop: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=1200&auto=format&fit=crop',
            poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=600&auto=format&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            cast: 'Derek de Lint, Sergio Hasselbaink',
            tags: 'Visual Effects, Sci-Fi, Dark'
        },
        {
            id: 'lofi-horizons',
            title: 'Lo-Fi Horizons',
            description: 'Escape into a world of chilled beats, ambient rain showers, and endless pixel skies. The ultimate relaxed visual journey for winding down.',
            genre: ['Music', 'Chill', 'Art'],
            rating: '93% Match',
            year: 2024,
            duration: '3h 10m',
            type: 'series',
            backdrop: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=1200&auto=format&fit=crop',
            poster: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&auto=format&fit=crop',
            videoUrl: 'sample-30s.mp4',
            cast: 'Pixel Artist, DJ Horizon',
            tags: 'Chill, Relaxing, Ambient'
        },
        {
            id: 'void-walker',
            title: 'VOID WALKER',
            description: 'In the deep silence of outer space, an astronaut discovers a cosmic anomaly that bends space-time, separating him from earth and his crew.',
            genre: ['Sci-Fi', 'Suspense', 'Adventure'],
            rating: '90% Match',
            year: 2023,
            duration: '1h 55m',
            type: 'movie',
            backdrop: 'https://images.unsplash.com/photo-1517411032315-54ef2cb00966?w=1200&auto=format&fit=crop',
            poster: 'https://images.unsplash.com/photo-1517411032315-54ef2cb00966?w=600&auto=format&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            cast: 'Sam Rockwell, Cillian Murphy',
            tags: 'Cosmic, Mystery, Atmospheric'
        },
        {
            id: 'retro-rewind',
            title: 'Retro Rewind',
            description: 'Travel back to the neon-drenched 1980s, exploring arcade rooms, cassette tape decks, and synthwave subcultures that shaped modern synth music.',
            genre: ['Documentary', 'Music', 'History'],
            rating: '88% Match',
            year: 2024,
            duration: '6 Episodes',
            type: 'series',
            backdrop: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&auto=format&fit=crop',
            poster: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&auto=format&fit=crop',
            videoUrl: 'sample-30s.mp4',
            cast: 'Giorgio Moroder, Kavinsky',
            tags: 'Nostalgic, Electric, Retro'
        }
    ];

    // ==========================================
    // 2. Fetch URL Parameter / Active Movie
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id') || 'kgf-2'; // default to KGF 2

    const activeMovie = moviesDatabase.find(m => m.id === movieId) || moviesDatabase[0];

    // ==========================================
    // 3. Populate Page Metadata
    // ==========================================
    document.title = `EnterNet | Watching: ${activeMovie.title}`;
    document.getElementById('playingTitle').textContent = activeMovie.title;
    document.getElementById('playingType').textContent = activeMovie.type === 'series' ? 'TV Show' : 'Movie';
    
    document.getElementById('movieTitle').textContent = activeMovie.title;
    document.getElementById('movieMatch').textContent = activeMovie.rating;
    document.getElementById('movieYear').textContent = activeMovie.year;
    document.getElementById('movieDuration').textContent = activeMovie.duration;
    document.getElementById('movieGenres').textContent = activeMovie.genre.join(' • ');
    document.getElementById('movieDesc').textContent = activeMovie.description;

    // Load recommendations
    const similarVideosGrid = document.getElementById('similarVideosGrid');
    similarVideosGrid.innerHTML = '';
    
    const otherMovies = moviesDatabase.filter(m => m.id !== activeMovie.id);
    otherMovies.slice(0, 8).forEach(movie => {
        const card = document.createElement('div');
        card.className = 'similar-card';
        card.innerHTML = `
            <div class="similar-card-img-wrapper">
                <img src="${movie.backdrop}" alt="${movie.title}">
            </div>
            <div class="similar-card-meta">
                <div class="similar-card-meta-row">
                    <span class="similar-card-title">${movie.title}</span>
                    <button class="btn-mini-round"><i class="fa-solid fa-play"></i></button>
                </div>
                <p class="similar-card-desc">${movie.description}</p>
            </div>
        `;
        card.addEventListener('click', () => {
            window.location.href = `watch.html?id=${movie.id}`;
        });
        similarVideosGrid.appendChild(card);
    });

    // ==========================================
    // 4. Custom Cinematic Video Player Logic
    // ==========================================
    const playerContainer = document.getElementById('videoPlayerContainer');
    const mainVideo = document.getElementById('mainVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const skipBackBtn = document.getElementById('skipBackBtn');
    const skipForwardBtn = document.getElementById('skipForwardBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const currentTimeText = document.getElementById('currentTime');
    const totalDurationText = document.getElementById('totalDuration');
    const speedBtn = document.getElementById('speedBtn');
    const speedLabel = document.getElementById('speedLabel');
    const speedMenu = document.getElementById('speedMenu');
    const pipBtn = document.getElementById('pipBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const progressBar = document.getElementById('progressBar');
    const bufferBar = document.getElementById('bufferBar');
    const progressArea = document.getElementById('progressArea');
    const timeTooltip = document.getElementById('timeTooltip');
    const playSplash = document.getElementById('playSplash');
    const videoLoader = document.getElementById('videoLoader');
    const toastContainer = document.getElementById('toastContainer');

    // Load active video source
    mainVideo.src = activeMovie.videoUrl;

    // Toast alert
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-check' : 'fa-info'}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    // Play / Pause Toggle Function
    function togglePlay() {
        if (mainVideo.paused) {
            mainVideo.play();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            playerContainer.classList.remove('paused');
            
            // Splash feedback animation
            playSplash.innerHTML = '<i class="fa-solid fa-play"></i>';
            playSplash.classList.remove('animate');
            void playSplash.offsetWidth; // trigger reflow
            playSplash.classList.add('animate');
        } else {
            mainVideo.pause();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            playerContainer.classList.add('paused');
            
            // Splash feedback animation
            playSplash.innerHTML = '<i class="fa-solid fa-pause"></i>';
            playSplash.classList.remove('animate');
            void playSplash.offsetWidth; // trigger reflow
            playSplash.classList.add('animate');
        }
    }

    playPauseBtn.addEventListener('click', togglePlay);
    mainVideo.addEventListener('click', togglePlay);

    // Auto-playing video loop on click
    mainVideo.addEventListener('waiting', () => {
        videoLoader.style.display = 'block';
    });
    mainVideo.addEventListener('playing', () => {
        videoLoader.style.display = 'none';
    });

    // Time calculations display format (e.g. 02:45)
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return "00:00";
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        min = min < 10 ? `0${min}` : min;
        sec = sec < 10 ? `0${sec}` : sec;
        return `${min}:${sec}`;
    }

    // Load meta duration data
    mainVideo.addEventListener('loadeddata', () => {
        totalDurationText.textContent = formatTime(mainVideo.duration);
    });

    // Progress updates
    mainVideo.addEventListener('timeupdate', (e) => {
        const current = mainVideo.currentTime;
        const duration = mainVideo.duration;
        currentTimeText.textContent = formatTime(current);
        
        if (duration) {
            const percent = (current / duration) * 100;
            progressBar.style.width = `${percent}%`;
            progressBar.nextElementSibling.style.left = `${percent}%`;
        }

        // Handle buffered bar
        if (mainVideo.buffered.length > 0) {
            const bufferedEnd = mainVideo.buffered.end(mainVideo.buffered.length - 1);
            const duration = mainVideo.duration;
            if (duration) {
                bufferBar.style.width = `${(bufferedEnd / duration) * 100}%`;
            }
        }
    });

    // Handle Manual Progress bar clicks & drags
    let isDragging = false;

    function scrubProgress(e) {
        const rect = progressArea.getBoundingClientRect();
        const scrubWidth = rect.width;
        let clientX = e.clientX;
        
        // Support touch coordinates
        if (e.type.startsWith('touch')) {
            clientX = e.touches[0].clientX;
        }

        let relativeX = clientX - rect.left;
        relativeX = Math.max(0, Math.min(relativeX, scrubWidth)); // clamp

        const percentage = relativeX / scrubWidth;
        progressBar.style.width = `${percentage * 100}%`;
        progressBar.nextElementSibling.style.left = `${percentage * 100}%`;
        
        mainVideo.currentTime = percentage * mainVideo.duration;
    }

    progressArea.addEventListener('mousedown', (e) => {
        isDragging = true;
        scrubProgress(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) scrubProgress(e);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Progress Bar Hover Tooltip Time tracking
    progressArea.addEventListener('mousemove', (e) => {
        const rect = progressArea.getBoundingClientRect();
        const hoverX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(hoverX / rect.width, 1));
        const previewTime = percentage * mainVideo.duration;
        
        timeTooltip.textContent = formatTime(previewTime);
        timeTooltip.style.left = `${hoverX}px`;
    });

    // Skip Buttons
    skipBackBtn.addEventListener('click', () => {
        mainVideo.currentTime = Math.max(0, mainVideo.currentTime - 10);
        showToast('Rewound 10s', 'info');
    });

    skipForwardBtn.addEventListener('click', () => {
        mainVideo.currentTime = Math.min(mainVideo.duration, mainVideo.currentTime + 10);
        showToast('Fast Forward 10s', 'info');
    });

    // Volume Actions
    function updateVolumeState() {
        mainVideo.volume = volumeSlider.value;
        if (mainVideo.volume === 0 || mainVideo.muted) {
            mainVideo.muted = true;
            muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        } else if (mainVideo.volume < 0.5) {
            mainVideo.muted = false;
            muteBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
        } else {
            mainVideo.muted = false;
            muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
    }

    volumeSlider.addEventListener('input', updateVolumeState);

    muteBtn.addEventListener('click', () => {
        mainVideo.muted = !mainVideo.muted;
        if (mainVideo.muted) {
            muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            volumeSlider.value = 0;
        } else {
            muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            volumeSlider.value = mainVideo.volume || 1;
        }
    });

    // Speed Selection Overlay actions
    speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speedMenu.classList.toggle('active');
    });

    document.querySelectorAll('.speed-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const speed = parseFloat(e.currentTarget.getAttribute('data-speed'));
            mainVideo.playbackRate = speed;
            
            // Sync text display label
            speedLabel.textContent = speed === 1 ? '1.0x' : `${speed}x`;

            // Active Class toggle
            document.querySelectorAll('.speed-option').forEach(opt => opt.classList.remove('active-speed'));
            e.currentTarget.classList.add('active-speed');
            
            speedMenu.classList.remove('active');
            showToast(`Speed updated to ${speed}x`, 'info');
        });
    });

    // Close speed selector if clicked outside
    document.addEventListener('click', () => {
        speedMenu.classList.remove('active');
    });

    // Fullscreen toggling logic
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            playerContainer.requestFullscreen()
                .then(() => {
                    fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
                })
                .catch(err => {
                    showToast('Fullscreen mode failed.', 'error');
                });
        } else {
            document.exitFullscreen()
                .then(() => {
                    fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
                });
        }
    }

    fullscreenBtn.addEventListener('click', toggleFullscreen);
    mainVideo.addEventListener('dblclick', toggleFullscreen);

    // Picture-in-Picture mode
    pipBtn.addEventListener('click', () => {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled) {
            mainVideo.requestPictureInPicture()
                .catch(() => {
                    showToast('Picture-in-picture failed.', 'error');
                });
        }
    });

    // Keyboard Shortcuts Actions
    document.addEventListener('keydown', (e) => {
        // If active in search inputs, skip
        if (document.activeElement.tagName === 'INPUT') return;

        switch (e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                togglePlay();
                break;
            case 'arrowleft':
                mainVideo.currentTime = Math.max(0, mainVideo.currentTime - 10);
                showToast('Rewound 10s', 'info');
                break;
            case 'arrowright':
                mainVideo.currentTime = Math.min(mainVideo.duration, mainVideo.currentTime + 10);
                showToast('Fast Forward 10s', 'info');
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'm':
                muteBtn.click();
                break;
            case 'arrowup':
                e.preventDefault();
                volumeSlider.value = Math.min(1, parseFloat(volumeSlider.value) + 0.1);
                updateVolumeState();
                break;
            case 'arrowdown':
                e.preventDefault();
                volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 0.1);
                updateVolumeState();
                break;
        }
    });

    // ==========================================
    // 5. Controls Auto-Hide Timers
    // ==========================================
    let controlsTimer;
    
    function resetControlsTimer() {
        playerContainer.classList.remove('hide-controls');
        clearTimeout(controlsTimer);
        
        // Hide only if video is actively playing
        if (!mainVideo.paused) {
            controlsTimer = setTimeout(() => {
                playerContainer.classList.add('hide-controls');
                // Auto-close speed selection menu if controls fade out
                speedMenu.classList.remove('active');
            }, 3000);
        }
    }

    playerContainer.addEventListener('mousemove', resetControlsTimer);
    mainVideo.addEventListener('play', resetControlsTimer);
    mainVideo.addEventListener('pause', () => {
        playerContainer.classList.remove('hide-controls');
        clearTimeout(controlsTimer);
    });

    // Boot player up
    resetControlsTimer();
});