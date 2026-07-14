document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Mock Movie Database (IMDB / Netflix Vibe)
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
            description: 'A lonely young woman searches desperately for her baby dragon companion, traveling across breathtaking snowy peaks and desolate deserts.',
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
            tags: 'Atmospheric, Suspenseful, Cosmic'
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
    // 2. State & DOM References
    // ==========================================
    let myList = JSON.parse(localStorage.getItem('myList')) || [];
    let currentProfile = localStorage.getItem('activeProfile') || 'Bhavesh';

    // DOM Elements
    const mainNav = document.getElementById('mainNav');
    const searchBox = document.getElementById('searchBox');
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');
    const browseContainer = document.getElementById('browseContainer');
    const featuredBillboard = document.getElementById('featuredBillboard');
    const moviesRowsSection = document.getElementById('moviesRowsSection');
    const searchResultsSection = document.getElementById('searchResultsSection');
    const searchResultsGrid = document.getElementById('searchResultsGrid');
    const searchQueryLabel = document.getElementById('searchQueryLabel');
    const billboardVideo = document.getElementById('billboardVideo');
    const billboardSoundBtn = document.getElementById('billboardSoundBtn');
    const soundIcon = document.getElementById('soundIcon');
    const currentAvatar = document.getElementById('currentAvatar');
    const toastContainer = document.getElementById('toastContainer');

    // Watch Party Sidebar elements
    const partySidebar = document.getElementById('partySidebar');
    const partySidebarToggle = document.getElementById('partySidebarToggle');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const startPartyBtn = document.getElementById('startPartyBtn');
    const partyStatusDot = document.getElementById('partyStatusDot');
    const partyStatusText = document.getElementById('partyStatusText');
    const chatMessages = document.getElementById('chatMessages');
    const chatInputWrapper = document.getElementById('chatInputWrapper');
    const chatPlaceholder = document.querySelector('.chat-placeholder');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');

    // Detail Modal elements
    const detailModal = document.getElementById('detailModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBannerImg = document.getElementById('modalBannerImg');
    const modalBannerVideo = document.getElementById('modalBannerVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalPlayBtn = document.getElementById('modalPlayBtn');
    const modalAddListBtn = document.getElementById('modalAddListBtn');
    const modalLikeBtn = document.getElementById('modalLikeBtn');
    const modalSoundBtn = document.getElementById('modalSoundBtn');
    const modalMatch = document.getElementById('modalMatch');
    const modalYear = document.getElementById('modalYear');
    const modalDuration = document.getElementById('modalDuration');
    const modalDesc = document.getElementById('modalDesc');
    const modalCast = document.getElementById('modalCast');
    const modalGenres = document.getElementById('modalGenres');
    const modalSimilarGrid = document.getElementById('modalSimilarGrid');

    // Profile Images Map
    const profileAvatars = {
        'Bhavesh': 'p.jpg',
        'Kids': 'l.jpg',
        'Guest': 't.jpg'
    };

    // ==========================================
    // 3. Helper Functions
    // ==========================================
    
    // Toast Alert
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-check' : 'fa-circle-exclamation'}"></i>
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

    // Scroll styling for Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // Sync profile display
    function updateProfileUI() {
        const avatarSrc = profileAvatars[currentProfile] || 'p.jpg';
        currentAvatar.querySelector('img').src = avatarSrc;
        
        // Highlight active profile in list
        document.querySelectorAll('.profile-option').forEach(opt => {
            if (opt.getAttribute('data-profile') === currentProfile) {
                opt.classList.add('active-profile');
            } else {
                opt.classList.remove('active-profile');
            }
        });
    }

    // ==========================================
    // 4. Movie Rendering Logic
    // ==========================================

    // Generate horizontal scroller card list
    function createMovieCard(movie) {
        const isFav = myList.includes(movie.id);
        const card = document.createElement('div');
        card.className = 'media-element';
        card.setAttribute('data-id', movie.id);
        
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
            <div class="media-info-popover">
                <div class="popover-actions">
                    <div class="popover-actions-left">
                        <button class="btn-mini-round play-now-mini" title="Play Video">
                            <i class="fa-solid fa-play"></i>
                        </button>
                        <button class="btn-mini-round toggle-fav-btn" title="${isFav ? 'Remove from My List' : 'Add to My List'}">
                            <i class="fa-solid ${isFav ? 'fa-check' : 'fa-plus'}"></i>
                        </button>
                        <button class="btn-mini-round like-mini-btn" title="Like">
                            <i class="fa-solid fa-thumbs-up"></i>
                        </button>
                    </div>
                    <button class="btn-mini-round open-details-btn" title="More Info">
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>
                </div>
                <div class="popover-meta">
                    <span class="match">${movie.rating}</span>
                    <span class="rating-tag">18+</span>
                    <span>${movie.duration}</span>
                </div>
                <div class="popover-genres">
                    ${movie.genre.map(g => `<span>${g}</span>`).join('')}
                </div>
            </div>
        `;

        // Card Click Interactions
        const openDetailTrigger = () => openModal(movie);
        const playVideoTrigger = (e) => {
            e.stopPropagation();
            window.location.href = `watch.html?id=${movie.id}`;
        };
        const toggleFavTrigger = (e) => {
            e.stopPropagation();
            toggleFavorite(movie.id);
        };

        card.addEventListener('click', openDetailTrigger);
        card.querySelector('.open-details-btn').addEventListener('click', openDetailTrigger);
        card.querySelector('.play-now-mini').addEventListener('click', playVideoTrigger);
        card.querySelector('.toggle-fav-btn').addEventListener('click', toggleFavTrigger);
        
        card.querySelector('.like-mini-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = e.currentTarget.querySelector('i');
            if(icon.classList.contains('fa-thumbs-up')) {
                icon.className = 'fa-solid fa-heart';
                showToast(`Liked ${movie.title}!`);
            } else {
                icon.className = 'fa-solid fa-thumbs-up';
            }
        });

        return card;
    }

    // Populate rows
    function renderBrowseRows() {
        moviesRowsSection.innerHTML = '';

        // Category Groups definitions
        const rowsConfig = [
            { title: 'My List', id: 'row-mylist', filter: (m) => myList.includes(m.id) },
            { title: 'Trending Now', id: 'row-trending', filter: () => true }, // All items
            { title: 'Sci-Fi & Cyberpunk Thrillers', id: 'row-scifi', filter: (m) => m.genre.includes('Sci-Fi') || m.genre.includes('Cyberpunk') },
            { title: 'KGF Bollywood Hits', id: 'row-kgf', filter: (m) => m.id.startsWith('kgf') },
            { title: 'TV & Episode Classics', id: 'row-tv', filter: (m) => m.type === 'series' }
        ];

        rowsConfig.forEach(row => {
            const filteredMovies = moviesDatabase.filter(row.filter);
            
            // Skip "My List" if it has no items
            if (row.id === 'row-mylist' && filteredMovies.length === 0) {
                return;
            }

            const rowDiv = document.createElement('div');
            rowDiv.className = 'movie-row';
            rowDiv.id = row.id;

            rowDiv.innerHTML = `
                <div class="row-header">
                    <h3>${row.title}</h3>
                </div>
                <div class="scroller-container">
                    <button class="scroller-arrow left"><i class="fa-solid fa-chevron-left"></i></button>
                    <div class="media-scroller snap-inline"></div>
                    <button class="scroller-arrow right"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
            `;

            const scroller = rowDiv.querySelector('.media-scroller');
            filteredMovies.forEach(movie => {
                scroller.appendChild(createMovieCard(movie));
            });

            // Bind Scroll arrow navigation actions
            const arrowLeft = rowDiv.querySelector('.scroller-arrow.left');
            const arrowRight = rowDiv.querySelector('.scroller-arrow.right');

            arrowLeft.addEventListener('click', () => {
                scroller.scrollLeft -= scroller.offsetWidth * 0.75;
            });
            arrowRight.addEventListener('click', () => {
                scroller.scrollLeft += scroller.offsetWidth * 0.75;
            });

            moviesRowsSection.appendChild(rowDiv);
        });
    }

    // Toggle items in watchlist
    function toggleFavorite(id) {
        const index = myList.indexOf(id);
        const movie = moviesDatabase.find(m => m.id === id);
        if (index > -1) {
            myList.splice(index, 1);
            showToast(`Removed ${movie.title} from My List.`, 'info');
        } else {
            myList.push(id);
            showToast(`Added ${movie.title} to My List!`);
        }
        localStorage.setItem('myList', JSON.stringify(myList));
        
        // Re-render rows to reflect modifications instantly
        renderBrowseRows();
        
        // If details modal is open, sync the icon as well
        if (detailModal.classList.contains('active') && modalAddListBtn.getAttribute('data-id') === id) {
            const isFav = myList.includes(id);
            modalAddListBtn.innerHTML = `<i class="fa-solid ${isFav ? 'fa-check' : 'fa-plus'}"></i>`;
        }
    }

    // ==========================================
    // 5. Billboard Featured Trailer Sync
    // ==========================================
    if (billboardPlayBtn) {
        billboardPlayBtn.addEventListener('click', () => {
            window.location.href = 'watch.html?id=neon-genesis';
        });
    }

    if (billboardInfoBtn) {
        billboardInfoBtn.addEventListener('click', () => {
            const featured = moviesDatabase.find(m => m.id === 'neon-genesis');
            openModal(featured);
        });
    }

    if (billboardSoundBtn && billboardVideo) {
        billboardSoundBtn.addEventListener('click', () => {
            billboardVideo.muted = !billboardVideo.muted;
            if (billboardVideo.muted) {
                soundIcon.className = 'fa-solid fa-volume-xmark';
                showToast('Billboard trailer muted', 'info');
            } else {
                soundIcon.className = 'fa-solid fa-volume-high';
                showToast('Billboard trailer unmuted');
            }
        });
    }

    // ==========================================
    // 6. Detailed Info Modal
    // ==========================================
    function openModal(movie) {
        modalBannerImg.src = movie.backdrop;
        modalTitle.textContent = movie.title;
        modalMatch.textContent = movie.rating;
        modalYear.textContent = movie.year;
        modalDuration.textContent = movie.duration;
        modalDesc.textContent = movie.description;
        modalCast.textContent = movie.cast;
        modalGenres.textContent = movie.genre.join(', ');
        
        // Bind Play Button
        modalPlayBtn.onclick = () => {
            window.location.href = `watch.html?id=${movie.id}`;
        };

        // Bookmark Add Button
        modalAddListBtn.setAttribute('data-id', movie.id);
        const isFav = myList.includes(movie.id);
        modalAddListBtn.innerHTML = `<i class="fa-solid ${isFav ? 'fa-check' : 'fa-plus'}"></i>`;
        modalAddListBtn.onclick = () => toggleFavorite(movie.id);

        // Sound controller for modal video preview (if we wanted to play video in modal)
        modalSoundBtn.onclick = () => {
            if (modalBannerVideo.src) {
                modalBannerVideo.muted = !modalBannerVideo.muted;
                modalSoundBtn.querySelector('i').className = `fa-solid ${modalBannerVideo.muted ? 'fa-volume-xmark' : 'fa-volume-high'}`;
            }
        };

        // Modal Rating Interaction
        modalLikeBtn.onclick = () => {
            showToast(`Rated ${movie.title} 5 stars!`);
        };

        // Load similar movie recommendations
        modalSimilarGrid.innerHTML = '';
        const similar = moviesDatabase.filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g)));
        
        similar.slice(0, 6).forEach(simMovie => {
            const card = document.createElement('div');
            card.className = 'similar-card';
            card.innerHTML = `
                <div class="similar-card-img-wrapper">
                    <img src="${simMovie.backdrop}" alt="${simMovie.title}">
                </div>
                <div class="similar-card-meta">
                    <div class="similar-card-meta-row">
                        <span class="similar-card-title">${simMovie.title}</span>
                        <button class="btn-mini-round play-similar"><i class="fa-solid fa-play"></i></button>
                    </div>
                    <p class="similar-card-desc">${simMovie.description}</p>
                </div>
            `;

            // Clicking similar card shifts modal to display it
            card.addEventListener('click', () => {
                openModal(simMovie);
                // Scroll modal viewport back to top
                detailModal.scrollTop = 0;
            });
            card.querySelector('.play-similar').addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = `watch.html?id=${simMovie.id}`;
            });

            modalSimilarGrid.appendChild(card);
        });

        // Display modal
        detailModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    }

    function closeModal() {
        detailModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Stop any videos playing inside modal
        modalBannerVideo.pause();
        modalBannerVideo.src = '';
        modalBannerVideo.style.display = 'none';
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    // Close modal clicking outside bounds
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && detailModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================
    // 7. Expandable Live Search
    // ==========================================
    searchBtn.addEventListener('click', () => {
        searchBox.classList.add('active');
        searchInput.focus();
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length > 0) {
            // Show search, hide standard browse items
            featuredBillboard.style.display = 'none';
            moviesRowsSection.style.display = 'none';
            searchResultsSection.style.display = 'block';
            searchQueryLabel.textContent = `"${e.target.value}"`;

            // Filter Movies
            const matches = moviesDatabase.filter(m => 
                m.title.toLowerCase().includes(query) ||
                m.description.toLowerCase().includes(query) ||
                m.genre.some(g => g.toLowerCase().includes(query)) ||
                m.cast.toLowerCase().includes(query)
            );

            // Populate Grid
            searchResultsGrid.innerHTML = '';
            if (matches.length > 0) {
                matches.forEach(movie => {
                    searchResultsGrid.appendChild(createMovieCard(movie));
                });
            } else {
                searchResultsGrid.innerHTML = `
                    <div class="chat-placeholder" style="grid-column: 1/-1; padding: 100px;">
                        <i class="fa-solid fa-circle-question"></i>
                        <p>No results found for "${e.target.value}". Try adjusting your keywords.</p>
                    </div>
                `;
            }
        } else {
            resetSearchState();
        }
    });

    searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        resetSearchState();
        searchBox.classList.remove('active');
    });

    function resetSearchState() {
        searchResultsSection.style.display = 'none';
        featuredBillboard.style.display = 'block';
        moviesRowsSection.style.display = 'flex';
        searchResultsGrid.innerHTML = '';
    }

    // ==========================================
    // 8. Watch Party Chat Sidebar Simulator
    // ==========================================
    let partyActive = false;
    let chatInterval = null;

    partySidebarToggle.addEventListener('click', () => {
        partySidebar.classList.toggle('active');
    });

    closeSidebarBtn.addEventListener('click', () => {
        partySidebar.classList.remove('active');
    });

    // Sync state
    startPartyBtn.addEventListener('click', () => {
        partyActive = !partyActive;
        
        if (partyActive) {
            startPartyBtn.textContent = 'End Watch Party';
            startPartyBtn.classList.add('active');
            partyStatusDot.className = 'status-dot online';
            partyStatusText.textContent = '🟢 Syncing with 3 Friends';
            chatPlaceholder.style.display = 'none';
            chatMessages.style.display = 'flex';
            chatInputWrapper.style.display = 'flex';
            showToast('Watch party started! Friends joined.');

            // Add starting messages
            addChatMessage('System', 'Party session started. Shared code: EN-942FB1E', true);
            
            // Periodically receive mock messages to simulate social activity
            const mockConversations = [
                { sender: 'Arav', text: 'Hey guys! Rocky looks intense in this scene 🔥' },
                { sender: 'Tanya', text: 'Wait! Did you guys see that transition? Infinity level UI!' },
                { sender: 'Guest_User', text: 'KGF is so good. Rockyyyy bhai!' },
                { sender: 'Arav', text: 'Let\'s watch Sintel next, I love dragons.' },
                { sender: 'Tanya', text: 'Wait up, going to grab popcorn 🍿' }
            ];

            let textIndex = 0;
            chatInterval = setInterval(() => {
                if (textIndex < mockConversations.length) {
                    const msg = mockConversations[textIndex++];
                    addChatMessage(msg.sender, msg.text);
                } else {
                    clearInterval(chatInterval);
                }
            }, 6000);
        } else {
            // Revert state
            clearInterval(chatInterval);
            startPartyBtn.textContent = 'Start Watch Party';
            startPartyBtn.classList.remove('active');
            partyStatusDot.className = 'status-dot offline';
            partyStatusText.textContent = 'Offline';
            chatPlaceholder.style.display = 'flex';
            chatMessages.style.display = 'none';
            chatInputWrapper.style.display = 'none';
            chatMessages.innerHTML = '';
            showToast('Watch party ended.', 'info');
        }
    });

    function addChatMessage(sender, text, isSystem = false) {
        const bubble = document.createElement('div');
        if (isSystem) {
            bubble.style.fontSize = '0.78rem';
            bubble.style.color = '#e50914';
            bubble.style.textAlign = 'center';
            bubble.style.margin = '10px 0';
            bubble.textContent = text;
        } else {
            const isMe = sender === currentProfile;
            bubble.className = `chat-msg ${isMe ? 'sent' : 'received'}`;
            bubble.innerHTML = `
                <span class="chat-msg-sender">${sender}</span>
                <div class="chat-msg-bubble">${text}</div>
            `;
        }
        chatMessages.appendChild(bubble);
        
        // Auto scroll chat to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Sending manual message
    function sendUserMsg() {
        const text = chatInput.value.trim();
        if (text) {
            addChatMessage(currentProfile, text);
            chatInput.value = '';
            
            // Auto response simulation
            setTimeout(() => {
                if (partyActive) {
                    addChatMessage('Arav', 'Nice! 👍');
                }
            }, 1500);
        }
    }

    sendChatBtn.addEventListener('click', sendUserMsg);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendUserMsg();
    });

    // ==========================================
    // 9. Profile switching dropdown options
    // ==========================================
    document.querySelectorAll('.profile-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const selected = e.currentTarget.getAttribute('data-profile');
            if (selected !== currentProfile) {
                currentProfile = selected;
                localStorage.setItem('activeProfile', currentProfile);
                updateProfileUI();
                showToast(`Switched profile to: ${currentProfile}`);
            }
        });
    });

    // Sign out alert
    document.getElementById('signOutLink').addEventListener('click', (e) => {
        showToast('Signing out...', 'info');
    });

    // Initialize Page
    updateProfileUI();
    renderBrowseRows();
});