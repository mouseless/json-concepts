(self.webpackChunkjson_concepts=self.webpackChunkjson_concepts||[]).push([[5697],{5194:(n,s,a)=>{"use strict";a.r(s),a.d(s,{data:()=>e});const e={key:"v-6f2b4268",path:"/specs/08-references/04-include.html",title:"Include",lang:"en-US",frontmatter:{},excerpt:"",headers:[{level:2,title:"Processing Order",slug:"processing-order",children:[]},{level:2,title:"Including a Remote File",slug:"including-a-remote-file",children:[]}],filePathRelative:"specs/08-references/04-include.md"}},9552:(n,s,a)=>{"use strict";a.r(s),a.d(s,{default:()=>p});const e=(0,a(6252).uE)('<h1 id="include"><a class="header-anchor" href="#include">#</a> Include</h1><p><code>#include</code> loads a concepts file from given path and replaces definitions inside that file to the place where it was included. Below, <code>$parameter</code> concept is included from another file;</p><p><code>CONCEPTS 1: parameter.concepts.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n    <span class="token property">&quot;$parameter*&quot;</span><span class="token operator">:</span> <span class="token string">&quot;$type&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p><code>CONCEPTS 2: service.concepts.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n    <span class="token property">&quot;$service+&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;#include&quot;</span><span class="token operator">:</span> <span class="token string">&quot;parameter.concepts.json&quot;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>Here <code>service.concepts.json</code> is equivalent to below concepts definition;</p><p><code>CONCEPTS 3: service.concepts.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n    <span class="token property">&quot;$service+&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;$parameter*&quot;</span><span class="token operator">:</span> <span class="token string">&quot;$type&quot;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="processing-order"><a class="header-anchor" href="#processing-order">#</a> Processing Order</h2><p>When a concepts definition is loaded, first <code>#include</code>s are processed. Then it should process references of included definition, and it finally places processed definition into where it was included. Below is an example;</p><p><code>CONCEPTS 1: method.concepts.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n   <span class="token property">&quot;$method*&quot;</span><span class="token operator">:</span> <span class="token string">&quot;#parameters &amp; #return&quot;</span><span class="token punctuation">,</span>\n    <span class="token property">&quot;#parameters&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;$parameter*&quot;</span><span class="token operator">:</span> <span class="token string">&quot;$type&quot;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token property">&quot;#return&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;returns&quot;</span><span class="token operator">:</span> <span class="token string">&quot;$type&quot;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p><code>CONCEPTS 2: class.concepts.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n    <span class="token property">&quot;$class+&quot;</span><span class="token operator">:</span> <span class="token string">&quot;#properties &amp; #methods&quot;</span><span class="token punctuation">,</span>\n    <span class="token property">&quot;#properties&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;$property*&quot;</span><span class="token operator">:</span> <span class="token string">&quot;$type&quot;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token property">&quot;#methods&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;#include&quot;</span><span class="token operator">:</span> <span class="token string">&quot;method.concepts.json&quot;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>For this example, processing order is as follows;</p><ul><li>Load file <code>class.concepts.json</code></li><li>Look for <code>#include</code>s <ul><li>Load file <code>method.concepts.json</code></li><li>Look for <code>#include</code>s <ul><li>None found</li></ul></li><li>Process references in <code>method.concepts.json</code></li><li>Place processed definition of <code>method.concepts.json</code> where it was included</li></ul></li><li>Process references in <code>class.concepts.json</code></li></ul><p>So it becomes a concepts definition equivalent to the following;</p><p><code>CONCEPTS 3: class.concepts.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n    <span class="token property">&quot;$class+&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;$property*&quot;</span><span class="token operator">:</span> <span class="token string">&quot;$type&quot;</span><span class="token punctuation">,</span>\n        <span class="token property">&quot;$method*&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n            <span class="token property">&quot;$parameter*&quot;</span><span class="token operator">:</span> <span class="token string">&quot;$type&quot;</span><span class="token punctuation">,</span>\n            <span class="token property">&quot;returns&quot;</span><span class="token operator">:</span> <span class="token string">&quot;$type&quot;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="including-a-remote-file"><a class="header-anchor" href="#including-a-remote-file">#</a> Including a Remote File</h2><p>You can also write a complete URL to include a concepts file. Below is an example;</p><p><code>CONCEPTS: service.concepts.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n    <span class="token property">&quot;$service+&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token property">&quot;#include&quot;</span><span class="token operator">:</span> <span class="token string">&quot;https://my-concepts.com/parameter.concepts.json&quot;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>',24),p={render:function(n,s){return e}}}}]);