(self.webpackChunkjson_concepts=self.webpackChunkjson_concepts||[]).push([[7890],{4525:(s,n,a)=>{"use strict";a.r(n),a.d(n,{data:()=>p});const p={key:"v-5436700e",path:"/roadmap/02-move-all-shadows-shadows-folder.html",title:"Move All Shadow Specs To Shadows Folder",lang:"en-US",frontmatter:{},excerpt:"",headers:[{level:2,title:"Concepts Shadow",slug:"concepts-shadow",children:[]}],filePathRelative:"roadmap/02-move-all-shadows-shadows-folder.md"}},8282:(s,n,a)=>{"use strict";a.r(n),a.d(n,{default:()=>e});const p=(0,a(6252).uE)('<h1 id="move-all-shadow-specs-to-shadows-folder"><a class="header-anchor" href="#move-all-shadow-specs-to-shadows-folder">#</a> Move All Shadow Specs To Shadows Folder</h1><blockquote><p>TBD - leave related parts of shadow specs if it is necessary for that spec only. e.g. below spec doesn&#39;t need to be in a separate section, and does not require to include the whole shadow</p><h2 id="concepts-shadow"><a class="header-anchor" href="#concepts-shadow">#</a> Concepts Shadow</h2><p>For following concepts definition, quantifier of <code>service</code> doesn&#39;t have a max;</p><p><code>CONCEPTS: service.concepts.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n    <span class="token property">&quot;$service+&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;$parameter?&quot;</span><span class="token operator">:</span> <span class="token string">&quot;$type&quot;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p><code>CONCEPTS SHADOW</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n    <span class="token property">&quot;concept&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;_&quot;</span><span class="token operator">:</span> <span class="token string">&quot;service&quot;</span><span class="token punctuation">,</span> \n        <span class="token property">&quot;quantifier&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token property">&quot;min&quot;</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token property">&quot;concept&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n            <span class="token property">&quot;_&quot;</span><span class="token operator">:</span> <span class="token string">&quot;parameter&quot;</span><span class="token punctuation">,</span>\n            <span class="token property">&quot;quantifier&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token property">&quot;min&quot;</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token property">&quot;max&quot;</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n            <span class="token property">&quot;variable&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n                <span class="token property">&quot;_&quot;</span><span class="token operator">:</span> <span class="token string">&quot;type&quot;</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>Leave only this part in that spec;</p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;concept&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      ...\n      <span class="token property">&quot;quantifier&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token property">&quot;min&quot;</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span>\n      ...\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div></blockquote>',2),e={render:function(s,n){return p}}}}]);