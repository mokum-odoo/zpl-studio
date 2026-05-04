import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Settings, Code, Printer, Download, RefreshCw, 
  AlertCircle, Maximize2, Layers, Info, Save, 
  ChevronDown, Ruler, Zap, BookOpen, X
} from 'lucide-react';

// The securely wrapped ZPL guide HTML payload
const GUIDE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
:root {
  --color-text-primary: #1e293b;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-border-primary: #cbd5e1;
  --color-border-secondary: #e2e8f0;
  --color-border-tertiary: #f1f5f9;
  --color-background-primary: #ffffff;
  --color-background-secondary: #f8fafc;
  --color-background-info: #eff6ff;
  --color-text-info: #1d4ed8;
  --border-radius-md: 6px;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: transparent; }
.container { padding: 1.5rem; font-size: 14px; color: var(--color-text-primary); }
.tabs { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
.tab { padding: 6px 14px; border: 0.5px solid var(--color-border-secondary); border-radius: var(--border-radius-md); background: transparent; color: var(--color-text-secondary); cursor: pointer; font-size: 13px; transition: all .15s; }
.tab.active { background: var(--color-background-secondary); color: var(--color-text-primary); border-color: var(--color-border-primary); font-weight: 500; }
.lesson { display: none; }
.lesson.active { display: block; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label-canvas { background: #fff; border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-md); position: relative; height: 260px; overflow: hidden; }
.label-canvas svg { width: 100%; height: 100%; }
.code-area { font-family: var(--font-mono); font-size: 12px; background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-md); padding: 10px; white-space: pre-wrap; line-height: 1.6; min-height: 120px; }
.cmd { color: #185FA5; font-weight: 500; }
.val { color: #3B6D11; }
.comment { color: var(--color-text-tertiary); font-style: italic; }
.controls { display: flex; flex-direction: column; gap: 10px; }
.control-row { display: flex; align-items: center; gap: 10px; }
.control-row label { font-size: 13px; color: var(--color-text-secondary); min-width: 80px; }
.control-row input[type=range] { flex: 1; }
.control-row span { font-size: 12px; min-width: 36px; text-align: right; }
.control-row input[type=text] { flex: 1; font-size: 13px; padding: 4px 8px; border-radius: var(--border-radius-md); border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); }
select { font-size: 13px; padding: 4px 8px; border-radius: var(--border-radius-md); border: 0.5px solid var(--color-border-secondary); background: var(--color-background-primary); color: var(--color-text-primary); }
.badge { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 500; margin-left: 6px; }
.badge-blue { background: var(--color-background-info); color: var(--color-text-info); }
.badge-green { background: #EAF3DE; color: #27500A; }
.cmd-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.cmd-table th { text-align: left; font-weight: 500; padding: 6px 10px; border-bottom: 0.5px solid var(--color-border-tertiary); color: var(--color-text-secondary); font-size: 12px; }
.cmd-table td { padding: 6px 10px; border-bottom: 0.5px solid var(--color-border-tertiary); vertical-align: top; }
.cmd-table tr:last-child td { border-bottom: none; }
.mono { font-family: var(--font-mono); font-size: 12px; color: #185FA5; }
.tip { background: var(--color-background-info); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-md); padding: 10px 14px; font-size: 13px; color: var(--color-text-secondary); margin-top: 12px; }
.tip strong { color: var(--color-text-info); }
.section-title { font-size: 13px; font-weight: 500; color: var(--color-text-secondary); margin: 0 0 6px; }
.live-zpl { background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-md); padding: 10px; font-family: var(--font-mono); font-size: 11px; line-height: 1.7; word-break: break-all; color: var(--color-text-secondary); margin-top: 10px; }
.quiz-opt { padding: 8px 14px; border: 0.5px solid var(--color-border-secondary); border-radius: var(--border-radius-md); cursor: pointer; font-size: 13px; margin-bottom: 6px; display: block; width: 100%; text-align: left; background: transparent; color: var(--color-text-primary); transition: all .15s; }
.quiz-opt:hover { background: var(--color-background-secondary); }
</style>
</head>
<body>
<div class="container">
  <div class="tabs">
    <button class="tab active" onclick="showLesson('basics')">1. Structure</button>
    <button class="tab" onclick="showLesson('text')">2. Text & Fonts</button>
    <button class="tab" onclick="showLesson('barcode')">3. Barcodes</button>
    <button class="tab" onclick="showLesson('cheatsheet')">4. Cheat Sheet</button>
  </div>

  <!-- LESSON 1: STRUCTURE -->
  <div class="lesson active" id="lesson-basics">
    <div class="two-col">
      <div>
        <p class="section-title">Every ZPL label has this skeleton:</p>
        <div class="code-area"><span class="cmd">^XA</span>          <span class="comment">← Start label</span>

  <span class="comment">← Your commands go here</span>

<span class="cmd">^XZ</span>          <span class="comment">← End label</span></div>
        <div class="tip"><strong>Key rule:</strong> Commands always start with <code>^</code> or <code>~</code>. Parameters follow immediately with no spaces. Order matters — ZPL reads top to bottom, left to right.</div>

        <p class="section-title" style="margin-top:14px">A complete minimal label:</p>
        <div class="code-area"><span class="cmd">^XA</span>
<span class="cmd">^FO</span><span class="val">50,50</span>   <span class="comment">← position: x=50, y=50</span>
<span class="cmd">^A0N</span><span class="val">,30,30</span>  <span class="comment">← font 0, 30×30 dots</span>
<span class="cmd">^FD</span><span class="val">Hello!</span><span class="cmd">^FS</span>  <span class="comment">← text data + close</span>
<span class="cmd">^XZ</span></div>

        <div class="tip" style="margin-top:10px"><strong>Dots vs mm:</strong> Zebra printers measure in dots. At 203 dpi (common), 1mm ≈ 8 dots. At 300 dpi, 1mm ≈ 12 dots.</div>
      </div>
      <div>
        <p class="section-title">Label preview (4" × 2"):</p>
        <div class="label-canvas">
          <svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="260" fill="#fff"/>
            <rect x="50" y="40" width="1" height="1" fill="transparent"/>
            <text x="50" y="75" font-family="monospace" font-size="26" fill="#222" font-weight="bold">Hello!</text>
            <text x="50" y="210" font-family="monospace" font-size="11" fill="#aaa">^FO50,50 → x=50, y=50 dots</text>
            <line x1="0" y1="50" x2="60" y2="50" stroke="#3B8BD4" stroke-width="0.5" stroke-dasharray="3 3"/>
            <line x1="50" y1="0" x2="50" y2="60" stroke="#3B8BD4" stroke-width="0.5" stroke-dasharray="3 3"/>
            <circle cx="50" cy="50" r="3" fill="#3B8BD4"/>
            <text x="55" y="48" font-size="10" fill="#3B8BD4" font-family="monospace">x=50</text>
            <text x="4" y="48" font-size="10" fill="#3B8BD4" font-family="monospace">y=50</text>
          </svg>
        </div>
        <div class="tip" style="margin-top:10px"><strong>Origin (0,0)</strong> is always the <em>top-left</em> corner of the label. X increases right, Y increases down.</div>
        <div class="tip" style="margin-top:10px; background: #EAF3DE; border-color: #639922; color: #27500A;">
          <strong>Pro Tip:</strong> Missing <code>^XA</code> or <code>^XZ</code> is the #1 reason a label fails to print. The printer simply ignores everything outside these two commands!
        </div>
      </div>
    </div>
  </div>

  <!-- LESSON 2: TEXT -->
  <div class="lesson" id="lesson-text">
    <p style="margin:0 0 12px;font-size:13px;color:var(--color-text-secondary)">Use the controls to build a text field and see the ZPL update live.</p>
    <div class="two-col">
      <div class="controls">
        <div class="control-row">
          <label>Text</label>
          <input type="text" id="txt-content" value="Sample Label" oninput="updateText()">
        </div>
        <div class="control-row">
          <label>X position</label>
          <input type="range" min="10" max="300" value="40" id="txt-x" oninput="updateText()">
          <span id="txt-x-val">40</span>
        </div>
        <div class="control-row">
          <label>Y position</label>
          <input type="range" min="10" max="220" value="60" id="txt-y" oninput="updateText()">
          <span id="txt-y-val">60</span>
        </div>
        <div class="control-row">
          <label>Font size</label>
          <input type="range" min="10" max="80" value="32" id="txt-size" oninput="updateText()">
          <span id="txt-size-val">32</span>
        </div>
        <div class="control-row">
          <label>Alignment</label>
          <select id="txt-align" onchange="updateText()">
            <option value="L">L — Left</option>
            <option value="C">C — Center</option>
            <option value="R">R — Right</option>
          </select>
        </div>
        <div class="control-row">
          <label>Orientation</label>
          <select id="txt-orient" onchange="updateText()">
            <option value="N">N — Normal</option>
            <option value="R">R — Rotate 90°</option>
            <option value="I">I — Inverted</option>
            <option value="B">B — Bottom-up</option>
          </select>
        </div>
        <div class="live-zpl" id="text-zpl"></div>
      </div>
      <div>
        <div class="label-canvas">
          <svg id="text-preview" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="260" fill="#fff"/>
          </svg>
        </div>
        <div class="tip" style="margin-top:10px">
          <strong>^A0N,h,w</strong> — font 0 (built-in), N=normal, h=height dots, w=width dots.<br>
          <strong>^FO x,y</strong> sets where the field starts.<br>
          <strong>^FB w,l,s,a</strong> — Field Block for wrapping and alignment.<br>
          <strong>^FD…^FS</strong> wraps your text.
        </div>
      </div>
    </div>
  </div>

  <!-- LESSON 3: BARCODES -->
  <div class="lesson" id="lesson-barcode">
    <div class="two-col">
      <div class="controls">
        <div class="control-row">
          <label>Data</label>
          <input type="text" id="bc-data" value="123456789" oninput="updateBarcode()">
        </div>
        <div class="control-row">
          <label>Type</label>
          <select id="bc-type" onchange="updateBarcode()">
            <option value="BC">^BC — Code 128</option>
            <option value="BE">^BE — EAN-13</option>
            <option value="BQ">^BQ — QR Code</option>
          </select>
        </div>
        <div class="control-row">
          <label>Height</label>
          <input type="range" min="30" max="160" value="80" id="bc-height" oninput="updateBarcode()">
          <span id="bc-height-val">80</span>
        </div>
        <div class="control-row">
          <label>X pos</label>
          <input type="range" min="10" max="250" value="40" id="bc-x" oninput="updateBarcode()">
          <span id="bc-x-val">40</span>
        </div>
        <div class="control-row">
          <label>Y pos</label>
          <input type="range" min="10" max="220" value="30" id="bc-y" oninput="updateBarcode()">
          <span id="bc-y-val">30</span>
        </div>
        <div class="live-zpl" id="bc-zpl"></div>
      </div>
      <div>
        <div class="label-canvas" id="bc-canvas">
          <svg id="bc-preview" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="260" fill="#fff"/>
          </svg>
        </div>
        <div class="tip" style="margin-top:10px">
          <strong>Common barcodes in ZPL:</strong><br>
          <code>^BC</code> Code 128 (general purpose)<br>
          <code>^BE</code> EAN-13 (retail)<br>
          <code>^BQ</code> QR Code (2D)<br>
          <code>^B3</code> Code 39<br><br>
          <strong>^BY w,r,h</strong> sets default bar width, ratio, height — put it <em>before</em> the barcode command.
        </div>
      </div>
    </div>
  </div>

  <!-- LESSON 4: CHEAT SHEET -->
  <div class="lesson" id="lesson-cheatsheet">
    <table class="cmd-table">
      <thead><tr><th>Command</th><th>Name</th><th>Syntax / Example</th><th>Purpose</th></tr></thead>
      <tbody>
        <tr><td class="mono">^XA / ^XZ</td><td>Label start/end</td><td class="mono">^XA … ^XZ</td><td>Wraps every label</td></tr>
        <tr><td class="mono">^FO</td><td>Field Origin</td><td class="mono">^FO x,y</td><td>Position of next field</td></tr>
        <tr><td class="mono">^FD … ^FS</td><td>Field Data</td><td class="mono">^FDHello^FS</td><td>Text content of a field</td></tr>
        <tr><td class="mono">^A</td><td>Font</td><td class="mono">^A0N,h,w</td><td>Built-in font, orientation, size</td></tr>
        <tr><td class="mono">^CF</td><td>Default font</td><td class="mono">^CF0,24</td><td>Set default font for whole label</td></tr>
        <tr><td class="mono">^BY</td><td>Bar default</td><td class="mono">^BY 2,3,80</td><td>Bar width, ratio, height</td></tr>
        <tr><td class="mono">^BC</td><td>Code 128</td><td class="mono">^BCN,80,Y,N</td><td>Most common linear barcode</td></tr>
        <tr><td class="mono">^BQ</td><td>QR Code</td><td class="mono">^BQN,2,5^FD…^FS</td><td>2D QR barcode</td></tr>
        <tr><td class="mono">^GB</td><td>Graphic Box</td><td class="mono">^GB w,h,t,c,r</td><td>Rectangle or line</td></tr>
        <tr><td class="mono">^GC</td><td>Graphic Circle</td><td class="mono">^GC d,t,c</td><td>Circle</td></tr>
        <tr><td class="mono">^FB</td><td>Field Block</td><td class="mono">^FB400,2,0,C</td><td>Text wrapping & alignment</td></tr>
        <tr><td class="mono">^FR</td><td>Field Reverse</td><td class="mono">^FR</td><td>Inverts text (white on black)</td></tr>
        <tr><td class="mono">~DG</td><td>Download Graphic</td><td class="mono">~DGlogo,size,w,data</td><td>Stores image in printer memory</td></tr>
        <tr><td class="mono">^PQ</td><td>Print Quantity</td><td class="mono">^PQ 10</td><td>Print 10 copies</td></tr>
        <tr><td class="mono">^LL</td><td>Label Length</td><td class="mono">^LL 400</td><td>Label height in dots</td></tr>
        <tr><td class="mono">^LH</td><td>Label Home</td><td class="mono">^LH 0,0</td><td>Offset origin of label</td></tr>
        <tr><td class="mono">^CI</td><td>Encoding</td><td class="mono">^CI28</td><td>UTF-8 character encoding</td></tr>
        <tr><td class="mono">~TA</td><td>Tear-off adj.</td><td class="mono">~TA000</td><td>Tear-off position</td></tr>
      </tbody>
    </table>
  </div>
</div>

<script>
function showLesson(id) {
  document.querySelectorAll('.lesson').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('lesson-'+id).classList.add('active');
  event.target.classList.add('active');
  if(id==='text') updateText();
  if(id==='barcode') updateBarcode();
}

function updateText() {
  const content = document.getElementById('txt-content').value || 'Text';
  const x = +document.getElementById('txt-x').value;
  const y = +document.getElementById('txt-y').value;
  const size = +document.getElementById('txt-size').value;
  const orient = document.getElementById('txt-orient').value;
  const align = document.getElementById('txt-align').value;

  document.getElementById('txt-x-val').textContent = x;
  document.getElementById('txt-y-val').textContent = y;
  document.getElementById('txt-size-val').textContent = size;

  let fb = '';
  if (align !== 'L') fb = "\\n^FB300,1,0," + align;

  document.getElementById('text-zpl').textContent = "^XA\\n^FO" + x + "," + y + "\\n^A0" + orient + "," + size + "," + size + fb + "\\n^FD" + content + "^FS\\n^XZ";
  const scale = 400/812;
  const sx = x * scale, sy = y * scale, fs = size * scale;
  const boxW = 300 * scale;

  let anchor = 'start';
  let textX = sx;
  if (align === 'C') { anchor = 'middle'; textX = sx + boxW/2; }
  if (align === 'R') { anchor = 'end'; textX = sx + boxW; }

  const svg = document.getElementById('text-preview');
  let helpers = '<circle cx="' + sx + '" cy="' + sy + '" r="3" fill="#3B8BD4"/>';
  if (align !== 'L') {
    helpers += '<rect x="' + sx + '" y="' + sy + '" width="' + boxW + '" height="' + (fs+4) + '" fill="none" stroke="#3B8BD4" stroke-dasharray="2 2" stroke-width="0.5"/>';
  }

  svg.innerHTML = '<rect width="400" height="260" fill="#fff"/>' + helpers +
    '<text x="' + textX + '" y="' + (sy+fs*0.85) + '" font-family="monospace" font-size="' + Math.max(9,fs) + '" fill="#222" text-anchor="' + anchor + '" ' + (orient==='I'?'transform="rotate(180,'+(sx+fs*3)+','+(sy+fs*0.5)+')"':'') + '>' + escHtml(content) + '</text>';
}

function updateBarcode() {
  const data = document.getElementById('bc-data').value || '12345';
  const type = document.getElementById('bc-type').value;
  const h = +document.getElementById('bc-height').value;
  const x = +document.getElementById('bc-x').value;
  const y = +document.getElementById('bc-y').value;
  document.getElementById('bc-height-val').textContent = h;
  document.getElementById('bc-x-val').textContent = x;
  document.getElementById('bc-y-val').textContent = y;
  const typeName = {'BC':'Code 128','BE':'EAN-13','BQ':'QR Code'}[type];
  document.getElementById('bc-zpl').textContent = "^XA\\n^FO" + x + "," + y + "\\n^BY2,3," + h + "\\n^" + type + "N," + h + ",Y,N\\n^FD" + data + "^FS\\n^XZ";
  const scale = 400/812;
  const sx = x*scale, sy=y*scale, bh=h*scale;
  const svg = document.getElementById('bc-preview');
  let bars = '';
  if(type==='BQ') {
    const q=Math.min(bh,90), qx=sx, qy=sy;
    const cell=q/7;
    const pattern=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]];
    for(let r=0;r<7;r++) for(let c=0;c<7;c++) if(pattern[r][c]) bars+='<rect x="' + (qx+c*cell) + '" y="' + (qy+r*cell) + '" width="' + cell + '" height="' + cell + '" fill="#111"/>';
    bars+='<text x="' + qx + '" y="' + (qy+q+14) + '" font-family="monospace" font-size="9" fill="#666">' + escHtml(data) + '</text>';
  } else {
    const bw=2, chars=data.length, totalW=chars*6*bw;
    for(let i=0;i<chars*5;i++) {
      if(i%3!==1) bars+='<rect x="' + (sx+i*bw) + '" y="' + sy + '" width="' + bw + '" height="' + bh + '" fill="#111"/>';
    }
    bars+='<text x="' + (sx+totalW/2) + '" y="' + (sy+bh+14) + '" text-anchor="middle" font-family="monospace" font-size="9" fill="#333">' + escHtml(data) + '</text>';
  }
  svg.innerHTML = '<rect width="400" height="260" fill="#fff"/><text x="10" y="14" font-size="10" fill="#aaa" font-family="monospace">' + typeName + '</text>' + bars;
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

updateText();
updateBarcode();
</script>
</body>
</html>
`;

const App = () => {
  const [zplCode, setZplCode] = useState(`^XA
^CF0,40
^FO50,40^GB80,80,80^FS
^FO150,60^FDZPL Designer^FS
^CF0,25
^FO150,110^FDDefault: 4 x 2 inch^FS
^FO50,160^GB700,3,3^FS
^BY3,2,70
^FO50,200^BCN,70,Y,N,N^FD12345678^FS
^XZ`);

  const [unit, setUnit] = useState('inch');
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(2);
  const [dpmm, setDpmm] = useState(8); 
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  
  // State for the ZPL interactive guide modal
  const [showGuide, setShowGuide] = useState(false);

  const isFirstRender = useRef(true);

  const toInches = (val) => unit === 'inch' ? val : (val / 25.4);
  const formatNum = (val) => parseFloat(val.toFixed(2));

  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return;
    if (newUnit === 'inch') {
      setWidth(formatNum(width / 25.4));
      setHeight(formatNum(height / 25.4));
    } else {
      setWidth(formatNum(width * 25.4));
      setHeight(formatNum(height * 25.4));
    }
    setUnit(newUnit);
  };

  const fetchPreview = useCallback(async () => {
    if (!zplCode.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    const widthIn = toInches(width).toFixed(2);
    const heightIn = toInches(height).toFixed(2);
    
    const url = `https://api.labelary.com/v1/printers/${dpmm}dpmm/labels/${widthIn}x${heightIn}/0/`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'image/png',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: zplCode
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API error ${response.status}`);
      }

      const blob = await response.blob();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const imageUrl = URL.createObjectURL(blob);
      setPreviewUrl(imageUrl);
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("ZPL Render Error:", err);
      setError(err.message.includes("Failed to fetch") 
        ? "Network Error: Could not connect to Labelary API."
        : `Render Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [zplCode, width, height, dpmm, unit, previewUrl]);

  useEffect(() => {
    if (isFirstRender.current) {
      fetchPreview();
      isFirstRender.current = false;
    }
  }, [fetchPreview]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        fetchPreview();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fetchPreview]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `label_${width}${unit}_x_${height}${unit}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg text-white shadow-lg">
            <Printer size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none mb-1 text-slate-800">ZPL STUDIO</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workspace</span>
              {lastSaved && (
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  SYNCED: {lastSaved}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowGuide(true)}
            title="Learn ZPL Basics"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-200 active:scale-95 shadow-sm hover:shadow-md"
          >
            <BookOpen size={16} className="text-indigo-500" />
            <span className="hidden sm:inline">ZPL Guide</span>
          </button>
          
          <button 
            onClick={fetchPreview}
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 shadow-indigo-200"
          >
            {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
            Preview Label
            <span className="opacity-60 text-[10px] font-normal border border-white/30 px-1 rounded ml-1 hidden sm:inline">
              ^S
            </span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Side: Editor */}
        <section className="w-[45%] flex flex-col border-r border-slate-200 bg-white">
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-end bg-slate-50/30">
            <div className="space-y-1.5 shrink-0">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Ruler size={10} /> Metrics
              </label>
              <div className="flex bg-slate-200 p-1 rounded-lg">
                <button onClick={() => handleUnitChange('mm')} className={`px-4 py-1.5 text-xs font-black rounded-md transition-all ${unit === 'mm' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>mm</button>
                <button onClick={() => handleUnitChange('inch')} className={`px-4 py-1.5 text-xs font-black rounded-md transition-all ${unit === 'inch' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>in</button>
              </div>
            </div>

            <div className="space-y-1.5 flex-1 min-w-[70px]">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Width</label>
              <input type="number" step="0.01" value={width} onChange={(e) => setWidth(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-mono font-bold" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-[70px]">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Height</label>
              <input type="number" step="0.01" value={height} onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-mono font-bold" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-[100px]">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Density</label>
              <select value={dpmm} onChange={(e) => setDpmm(parseInt(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm bg-white font-bold cursor-pointer">
                <option value={8}>203 DPI</option>
                <option value={12}>300 DPI</option>
                <option value={24}>600 DPI</option>
              </select>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative group">
            <div className="absolute top-3 left-4 flex items-center gap-2 z-10 pointer-events-none opacity-40">
              <Code size={14} className="text-slate-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Source Script</span>
            </div>
            <textarea
              value={zplCode}
              onChange={(e) => setZplCode(e.target.value)}
              className="flex-1 w-full p-12 pt-14 font-mono text-sm leading-relaxed text-slate-700 focus:outline-none resize-none bg-white selection:bg-indigo-100"
              spellCheck="false"
              placeholder="^XA ... ^XZ"
            />
            {error && (
              <div className="absolute bottom-4 left-4 right-4 bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-700 shadow-xl animate-in slide-in-from-bottom-4">
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-500" />
                <div className="text-xs">
                  <p className="font-black mb-1 uppercase tracking-wider">Syntax Error</p>
                  <p className="opacity-90 font-mono break-all">{error}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Side: Enhanced Printer Preview Area */}
        <section className="flex-1 bg-[#d1d5db] flex flex-col relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]">
          <div className="p-4 flex items-center justify-between border-b border-slate-300 bg-white/20 backdrop-blur-md z-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Printer Viewport</span>
            </div>
            <button 
              onClick={handleDownload}
              disabled={!previewUrl || isLoading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-700 bg-white/50 hover:bg-white rounded-xl transition-all disabled:opacity-30 border border-white/50 hover:shadow-md"
            >
              <Download size={14} />
              EXPORT PNG
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-start p-12 pt-24 overflow-auto scrollbar-hide">
            
            {/* THE PRINTER BODY (Industrial Desktop Mockup) */}
            <div className="relative flex flex-col items-center w-full max-w-[560px]">
              
              {/* Clamshell Top */}
              <div className="relative w-full h-40 bg-gradient-to-b from-[#374151] to-[#1f2937] rounded-t-[50px] shadow-2xl border-x-4 border-t-4 border-[#4b5563] flex flex-col items-center justify-center group overflow-hidden">
                {/* Visual Highlights */}
                <div className="absolute top-0 w-full h-1 bg-white/10" />
                <div className="absolute top-6 left-12 w-24 h-4 bg-black/40 rounded-full" /> {/* Side vent */}
                
                {/* LCD Display Panel */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-40 h-20 bg-[#0f172a] rounded-2xl border-2 border-slate-700 flex flex-col items-center justify-center p-2 shadow-inner">
                   <div className="text-[9px] font-mono text-emerald-400 self-start opacity-70 mb-1">ONLINE</div>
                   <div className="text-sm font-mono text-emerald-300 font-bold tracking-tighter">
                     {width} × {height} {unit.toUpperCase()}
                   </div>
                   <div className="w-full h-1 bg-slate-900 rounded-full mt-2 overflow-hidden">
                     <div className={`h-full bg-emerald-500 transition-all duration-1000 ${isLoading ? 'w-full animate-pulse' : 'w-[30%]'}`} />
                   </div>
                </div>

                {/* Control Buttons */}
                <div className="absolute bottom-6 right-12 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#111827] border border-slate-700 shadow-lg flex items-center justify-center active:scale-95 cursor-pointer">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#111827] border-2 border-emerald-500/50 shadow-lg flex items-center justify-center active:scale-90 cursor-pointer group/feed">
                    <RefreshCw size={14} className={`text-emerald-400 group-hover/feed:rotate-180 transition-transform ${isLoading ? 'animate-spin' : ''}`} />
                  </div>
                </div>
              </div>

              {/* PRINT HEAD AREA / OUTPUT SLOT */}
              <div className="relative w-[105%] h-14 bg-gradient-to-b from-[#111827] to-[#1f2937] z-20 -mx-[2.5%] shadow-xl border-x-4 border-slate-800 flex justify-center items-center">
                 {/* The Actual Slot */}
                 <div className="w-[90%] h-6 bg-black rounded-b-2xl shadow-[inset_0_4px_10px_rgba(255,255,255,0.05)] border-t border-slate-700/30 flex justify-center">
                    <div className="w-full h-px bg-white/5 mt-1" />
                 </div>
                 {/* Decorative Hardware Bolts */}
                 <div className="absolute left-6 w-3 h-3 bg-slate-700 rounded-full shadow-inner" />
                 <div className="absolute right-6 w-3 h-3 bg-slate-700 rounded-full shadow-inner" />
              </div>

              {/* THE LABEL ROLL / CONTINUOUS PAPER EFFECT */}
              <div className="relative z-10 w-full flex flex-col items-center -mt-3">
                {previewUrl ? (
                  <div className={`relative transition-all duration-1000 origin-top ${isLoading ? 'opacity-30 blur-md scale-[0.98]' : 'opacity-100 scale-100'}`}>
                    
                    {/* Measurement HUD (Hover only) */}
                    <div className="absolute -top-10 left-0 right-0 flex justify-center group-hover:opacity-100 transition-opacity">
                      <div className="bg-slate-800 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-2xl flex items-center gap-2">
                        <Maximize2 size={10} /> {width} × {height} {unit}
                      </div>
                    </div>
                    
                    {/* The Printed Label with Roll Background */}
                    <div className="relative group/label">
                      
                      {/* Thermal Paper "Tail" - the piece coming from inside the printer */}
                      <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black/70 via-yellow-100/60 to-transparent z-20 pointer-events-none rounded-t-[4px]" />

                      {/* Continuous Roll Background (Decorative strip behind the label) */}
                      <div className="absolute -inset-x-4 -bottom-12 h-20 bg-yellow-100/20 blur-xl rounded-[100%] pointer-events-none" />

                      {/* THE ACTUAL LABEL ROLL (Die-Cut Effect on Yellow Backing) */}
                      <div className="bg-[#fefce8] shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[4px] overflow-hidden border border-yellow-200 flex flex-col items-center">
                        
                        {/* TOP SECTION: Previous label "hint" and perforation */}
                        {/* Previous label bottom edge */}
                        <div className="h-6 w-[94%] bg-white rounded-b-sm shadow-sm border-b border-slate-200 opacity-60" />
                        
                        {/* Top Perforation Line */}
                        <div className="h-6 w-full flex items-center justify-center bg-[#fefce8]">
                           <div className="w-[85%] border-b border-dashed border-yellow-400" />
                        </div>
                        
                        {/* Gap before the main label */}
                        <div className="w-full h-2 bg-[#fefce8]" />

                        {/* THE ACTUAL WHITE LABEL */}
                        <div className="w-[94%] relative bg-white rounded-sm shadow-sm border border-slate-200 flex justify-center">
                          <img 
                            src={previewUrl} 
                            alt="ZPL Print Result" 
                            className="bg-white max-w-full h-auto block"
                            style={{ maxHeight: '60vh' }}
                          />
                        </div>

                        {/* BOTTOM SECTION: Gap, Perforation, Next label "hint" */}
                        {/* Gap below the main label */}
                        <div className="w-full h-2 bg-[#fefce8]" />

                        {/* Bottom Perforation Line / Gap between labels */}
                        <div className="h-6 w-full flex items-center justify-center bg-[#fefce8]">
                           <div className="w-[85%] border-b border-dashed border-yellow-400" />
                        </div>
                        
                        {/* Next label "hint" showing it's a roll */}
                        <div className="h-8 w-[94%] bg-white rounded-t-sm shadow-sm border-t border-slate-200 opacity-60" />
                      </div>
                    </div>
                  </div>
                ) : !isLoading ? (
                  <div className="mt-20 p-8 rounded-3xl bg-white/30 border-2 border-dashed border-white flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                       <Zap className="text-indigo-500" size={32} />
                    </div>
                    <div>
                      <p className="text-slate-800 font-black text-sm uppercase tracking-widest">Printer Ready</p>
                      <p className="text-slate-600 text-xs mt-2 max-w-[200px]">Design your ZPL code and press Save to print a virtual thermal label.</p>
                    </div>
                  </div>
                ) : null}
                
                {isLoading && !previewUrl && (
                  <div className="flex flex-col items-center gap-4 p-12 mt-12 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl">
                    <RefreshCw size={48} className="text-indigo-500 animate-spin" />
                    <p className="text-slate-800 font-black text-sm tracking-widest animate-pulse">THERMAL PRINTING...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Diagnostic Panel */}
          <div className="p-4 bg-white/50 border-t border-slate-300 flex justify-between items-center z-10 backdrop-blur-lg">
            <div className="flex gap-8">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Interface</span>
                <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" /> VIRTUAL_COM4
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Media</span>
                <div className="text-xs font-bold text-slate-700">CONTINUOUS_THERMAL</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Powered By</span>
              <div className="text-[11px] font-black text-slate-400">LABELARY_2.0_ENGINE</div>
            </div>
          </div>
        </section>
      </main>

      {/* Embedded Interactive ZPL Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <BookOpen className="text-indigo-600" size={20}/> 
                Interactive ZPL Learning Guide
              </h2>
              <button
                onClick={() => setShowGuide(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                title="Close Guide"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 bg-white overflow-hidden relative">
              <iframe
                srcDoc={GUIDE_HTML}
                className="absolute inset-0 w-full h-full border-0"
                title="ZPL Interactive Guide"
              />
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes slide-in-from-bottom-4 {
          from { transform: translateY(1rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-in { animation: slide-in-from-bottom-4 0.4s ease-out; }
      `}} />
    </div>
  );
};

export default App;