// مناسبتي — picker, calendar, live preview
(function () {
  const GROUPS = [
    { label: '🌙 مناسبات إسلامية', items: [
      ['ramadan', 'رمضان'], ['eid_fitr', 'عيد الفطر'], ['eid_adha', 'عيد الأضحى'],
      ['hijri_newyear', 'رأس السنة الهجرية'], ['mawlid', 'المولد النبوي'], ['israa', 'الإسراء والمعراج'],
    ]},
    { label: '⛪ مناسبات مسيحية', items: [
      ['christmas', 'عيد الميلاد'], ['epiphany', 'عيد الغطاس'], ['easter', 'عيد القيامة'], ['sham', 'شم النسيم'],
    ]},
    { label: '🎉 مناسبات عامة', items: [
      ['newyear', 'رأس السنة'], ['mothersday', 'عيد الأم'], ['birthday', 'عيد ميلاد'], ['wedding', 'زفاف'],
    ]},
  ];

  const CAL = [
    ['عيد الميلاد الغربي', 'بداية موسم الكريسماس عند كتير من الناس.', '٢٥ ديسمبر ٢٠٢٦'],
    ['رأس السنة الميلادية', 'التهنئة الأكثر انتشارًا في السنة كلها.', '١ يناير ٢٠٢٧'],
    ['الإسراء والمعراج', '٢٧ رجب ١٤٤٨ هـ — تاريخ متوقع.', '٥ يناير ٢٠٢٧'],
    ['عيد الميلاد المجيد', 'الكريسماس القبطي — تهاني للأهل والأصحاب.', '٧ يناير ٢٠٢٧'],
    ['عيد الغطاس', 'ثالث أعياد الميلاد.', '١٩ يناير ٢٠٢٧'],
    ['رمضان ١٤٤٨', 'متوقع ٨ فبراير — موسم التهاني الأكبر.', '٨ فبراير ٢٠٢٧'],
    ['عيد الفطر ١٤٤٨', 'متوقع ٩–١٠ مارس حسب رؤية الهلال.', '٩ مارس ٢٠٢٧'],
    ['عيد الأم', 'أجمل فيديو لأغلى اسم.', '٢١ مارس ٢٠٢٧'],
    ['عيد القيامة المجيد', 'أكبر الأعياد القبطية.', '٢ مايو ٢٠٢٧'],
    ['شم النسيم', 'يوم الربيع والفسحة — بكرة عيد القيامة.', '٣ مايو ٢٠٢٧'],
    ['عيد الأضحى ١٤٤٨', 'متوقع ١٥–١٦ مايو حسب رؤية الهلال.', '١٥ مايو ٢٠٢٧'],
    ['رأس السنة الهجرية ١٤٤٩', 'أول محرم — متوقع.', '٦ يونيو ٢٠٢٧'],
    ['المولد النبوي ١٤٤٩', '١٢ ربيع الأول — متوقع.', '١٥ أغسطس ٢٠٢٧'],
  ];

  const picker = document.getElementById('picker');
  let current = 'ramadan';
  const btns = {};
  GROUPS.forEach((g) => {
    const lbl = document.createElement('div');
    lbl.className = 'grp-label';
    lbl.textContent = g.label;
    picker.appendChild(lbl);
    const row = document.createElement('div');
    row.className = 'btns';
    g.items.forEach(([key, label]) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.onclick = () => { current = key; Object.values(btns).forEach((x) => x.classList.remove('on')); b.classList.add('on'); };
      btns[key] = b;
      row.appendChild(b);
    });
    picker.appendChild(row);
  });
  btns[current].classList.add('on');

  const cal = document.getElementById('cal');
  CAL.forEach(([nm, dt, vl]) => {
    const d = document.createElement('div');
    d.className = 'row';
    d.innerHTML = '<div><div class="nm"></div><div class="dt"></div></div><div class="vl"></div>';
    d.querySelector('.nm').textContent = nm;
    d.querySelector('.dt').textContent = dt;
    d.querySelector('.vl').textContent = vl;
    cal.appendChild(d);
  });

  const cv = document.getElementById('cv');
  const ctx = cv.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = 540 * dpr; cv.height = 540 * dpr;
  ctx.scale(dpr, dpr);
  const nm = document.getElementById('nm');
  const t0 = performance.now();
  (function tick(now) {
    MUN.drawScene(ctx, current, nm.value, (now - t0) / 1000);
    requestAnimationFrame(tick);
  })(t0);
})();
