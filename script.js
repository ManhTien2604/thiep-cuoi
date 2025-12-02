
(function(){
  const el = (id) => document.getElementById(id);
  const safe = (v, d='') => (v === undefined || v === null || v === '') ? d : v;

  async function loadConfig(){
    try {
      const res = await fetch('config.json');
      if (!res.ok) throw new Error('Không thể tải config');
      const cfg = await res.json();
      applyConfig(cfg);
    } catch (e) {
      console.warn('Lỗi tải config, dùng mặc định:', e);
      applyConfig(defaultConfig());
    }
  }

  function defaultConfig(){
    return {
      lang: 'vi-VN',
      couple: { bride_name: 'Tên Cô Dâu', groom_name: 'Tên Chú Rể' },
      date: '2026-01-10',
      time: '17:30',
      invite_text: 'Kính mời Quý Anh/Chị/Bạn đến chung vui cùng chúng tôi trong ngày trọng đại.',
      venue: { name: 'Nhà hàng Tiệc Cưới', address: '123 Đường Hoa, Quận 1, TP.HCM', map_url: 'https://maps.google.com' },
      schedule: [
        { time: '16:30', title: 'Đón khách' },
        { time: '17:30', title: 'Lễ thành hôn' },
        { time: '18:00', title: 'Khai tiệc & văn nghệ' }
      ],
      gallery: [],
      rsvp: { method: 'mailto', mailto: 'example@email.com' },
      theme: { primary_color: '#C59D7C', background: '#FFF5EC', font_heading: 'Playfair Display', font_body: 'Inter' },
      hosted_by: 'Gia đình hai bên'
    }
  }

  function applyConfig(cfg){
    try {
      // Theme
      const root = document.documentElement;
      if (cfg.theme?.primary_color) root.style.setProperty('--primary', cfg.theme.primary_color);
      if (cfg.theme?.background) root.style.setProperty('--background', cfg.theme.background);
      if (cfg.theme?.font_heading) root.style.setProperty('--font-heading', cfg.theme.font_heading);
      if (cfg.theme?.font_body) root.style.setProperty('--font-body', cfg.theme.font_body);

      // Names & date
      const names = `${safe(cfg.couple?.bride_name, 'Cô Dâu')} & ${safe(cfg.couple?.groom_name, 'Chú Rể')}`;
      el('coupleNames').textContent = names;
      el('footerNames').textContent = names;
      const dateText = formatDateTime(cfg.date, cfg.time, cfg.lang || 'vi-VN');
      el('weddingDate').textContent = dateText;

      // Invite text
      el('inviteText').textContent = safe(cfg.invite_text, 'Kính mời Quý Anh/Chị/Bạn đến chung vui cùng chúng tôi trong ngày trọng đại.');

      // Schedule
      const timeline = el('timeline');
      timeline.innerHTML = '';
      (cfg.schedule || []).forEach(it => {
        const li = document.createElement('li');
        const time = document.createElement('time');
        time.textContent = safe(it.time);
        const div = document.createElement('div');
        div.textContent = safe(it.title);
        li.appendChild(time); li.appendChild(div);
        timeline.appendChild(li);
      });

      // Venue
      el('venueName').textContent = safe(cfg.venue?.name, 'Địa điểm');
      el('venueAddress').textContent = safe(cfg.venue?.address, 'Địa chỉ');
      const mapLink = el('mapLink');
      mapLink.href = safe(cfg.venue?.map_url, '#');
      mapLink.textContent = 'Xem bản đồ';

      // Gallery
      const grid = el('galleryGrid');
      grid.innerHTML = '';
      (cfg.gallery || []).forEach(src => {
        const img = document.createElement('img');
        img.src = src; img.alt = 'Ảnh cưới';
        grid.appendChild(img);
      });

      // RSVP
      setupRSVP(cfg, names, dateText);

      // Countdown
      setupCountdown(cfg.date, cfg.time);

      // Share
      setupShare(names);

      // Footer year & scroll
      el('year').textContent = new Date().getFullYear();

    } catch (err){
      console.error('Lỗi áp dụng config:', err);
    }
  }

  function formatDateTime(dateStr, timeStr, locale){
    try {
      const [Y, M, D] = dateStr.split('-').map(Number);
      const [hh, mm] = (timeStr || '00:00').split(':').map(Number);
      const dt = new Date(Y, (M-1), D, hh, mm);
      const dateFmt = new Intl.DateTimeFormat(locale, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(dt);
      const timeFmt = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(dt);
      return `${dateFmt} • ${timeFmt}`;
    } catch(e){
      return `${dateStr} ${timeStr || ''}`.trim();
    }
  }

  function setupCountdown(dateStr, timeStr){
    const target = (()=>{
      if (!dateStr) return null;
      try {
        const [Y, M, D] = dateStr.split('-').map(Number);
        const [hh, mm] = (timeStr || '00:00').split(':').map(Number);
        return new Date(Y, M-1, D, hh, mm).getTime();
      } catch { return null; }
    })();
    function tick(){
      if (!target){ return; }
      const now = Date.now();
      let diff = Math.max(0, target - now);
      const s = Math.floor(diff / 1000);
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const ss = s % 60;
      document.getElementById('dd').textContent = String(d).padStart(2,'0');
      document.getElementById('hh').textContent = String(h).padStart(2,'0');
      document.getElementById('mm').textContent = String(m).padStart(2,'0');
      document.getElementById('ss').textContent = String(ss).padStart(2,'0');
    }
    tick();
    setInterval(tick, 1000);
  }

  function setupRSVP(cfg, names, dateText){
    const wrap = document.getElementById('rsvpContainer');
    wrap.innerHTML = '';
    const method = cfg.rsvp?.method || 'mailto';
    if (method === 'mailto'){
      const mail = cfg.rsvp?.mailto || 'example@email.com';
      const btn = document.createElement('a');
      btn.className = 'btn btn-primary';
      const subject = encodeURIComponent(`RSVP: ${names}`);
      const body = encodeURIComponent(`Xin chào,

Tôi xác nhận tham dự tiệc cưới.
Tên: 
Số điện thoại: 
Số lượng khách: 
Lời nhắn: 

Sự kiện: ${dateText}`);
      btn.href = `mailto:${mail}?subject=${subject}&body=${body}`;
      btn.textContent = 'Gửi email xác nhận';
      wrap.appendChild(btn);
      const note = document.createElement('p');
      note.className = 'note';
      note.textContent = `Hoặc liên hệ qua điện thoại: ${safe(cfg.rsvp?.phone, '')}`;
      wrap.appendChild(note);
    } else if (method === 'google_form'){
      const url = cfg.rsvp?.google_form_url || '#';
      const a = document.createElement('a');
      a.className = 'btn btn-primary'; a.href = url; a.target = '_blank';
      a.textContent = 'Mở form RSVP';
      wrap.appendChild(a);
    } else if (method === 'formspree'){
      const endpoint = cfg.rsvp?.formspree_endpoint;
      const form = document.createElement('form');
      form.innerHTML = `
        <div class="grid" style="grid-template-columns:1fr 1fr; gap:12px;">
          <input required name="name" placeholder="Họ và tên" />
          <input required name="phone" placeholder="Số điện thoại" />
          <input required type="number" min="1" name="guests" placeholder="Số lượng khách" />
          <textarea name="message" placeholder="Lời nhắn" style="grid-column:1/-1"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top:12px;">Gửi xác nhận</button>
      `;
      form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        try {
          const res = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
          if (res.ok){ alert('Đã gửi RSVP, xin cảm ơn!'); form.reset(); }
          else { alert('Gửi thất bại, vui lòng thử lại.'); }
        } catch(err){ alert('Lỗi mạng, vui lòng thử lại.'); }
      });
      wrap.appendChild(form);
    }
    document.getElementById('hostedBy').textContent = safe(cfg.hosted_by, 'Gia đình hai bên trân trọng kính mời.');
  }

  function setupShare(names){
    const btn = document.getElementById('shareBtn');
    btn.addEventListener('click', async ()=>{
      const shareData = { title: `Thiệp cưới | ${names}`, text: 'Kính mời bạn chung vui cùng chúng tôi', url: location.href };
      if (navigator.share){
        try { await navigator.share(shareData); } catch{}
      } else {
        try {
          await navigator.clipboard.writeText(location.href);
          btn.textContent = 'Đã sao chép liên kết';
          setTimeout(()=> btn.textContent = 'Chia sẻ thiệp', 2000);
        } catch {
          alert('Sao chép liên kết: ' + location.href);
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', loadConfig);
})();
