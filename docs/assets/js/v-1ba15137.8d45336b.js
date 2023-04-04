(self.webpackChunkjson_concepts=self.webpackChunkjson_concepts||[]).push([[6132],{2605:(s,n,a)=>{"use strict";a.r(n),a.d(n,{data:()=>e});const e={key:"v-1ba15137",path:"/specs/01-basics/01-literals.html",title:"Literals",lang:"en-US",frontmatter:{},excerpt:"",headers:[],filePathRelative:"specs/01-basics/01-literals.md"}},683:(s,n,a)=>{"use strict";a.r(n),a.d(n,{default:()=>t});const e=(0,a(6252).uE)('<h1 id="literals"><a class="header-anchor" href="#literals">#</a> Literals</h1><p>A literal is an expression that is expected in a schema as it appears in the concepts definition. Below definition has <code>sayHello</code>, <code>name</code> and <code>string</code> as literals.</p><p><code>CONCEPTS: service.concepts.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n    <span class="token property">&quot;sayHello&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>Literals on the <strong>left-hand</strong> side are called <strong>key literals</strong>, literals on the <strong>right-hand</strong> side are called <strong>value literals</strong>. So <code>sayHello</code> and <code>name</code> are <strong>key literals</strong>, <code>string</code> is a <strong>value literal</strong>.</p><p>Since this concepts definition consists of only literals, it only validates itself;</p><p><code>SCHEMA: greeting.service.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n    <span class="token property">&quot;sayHello&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>',8),t={render:function(s,n){return e}}}}]);