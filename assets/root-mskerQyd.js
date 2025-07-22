import{w as a,q as i,p as s,M as c,L as l,S as p,t as h,O as u,i as d}from"./chunk-EF7DTUVF-2iiA7sVW.js";const f=()=>[{rel:"preconnect",href:"https://fonts.googleapis.com"},{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"},{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"}];function x({children:e}){return s.jsxs("html",{lang:"en",children:[s.jsxs("head",{children:[s.jsx("meta",{charSet:"utf-8"}),s.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),s.jsx(c,{}),s.jsx(l,{}),s.jsx("script",{dangerouslySetInnerHTML:{__html:`
              // Single Page Apps for GitHub Pages
              // https://github.com/rafgraph/spa-github-pages
              (function(l) {
                if (l.search[1] === '/' ) {
                  var decoded = l.search.slice(1).split('&').map(function(s) { 
                    return s.replace(/~and~/g, '&')
                  }).join('?');
                  window.history.replaceState(null, null,
                      l.pathname.slice(0, -1) + decoded + l.hash
                  );
                }
              }(window.location))
            `}})]}),s.jsxs("body",{children:[e,s.jsx(p,{}),s.jsx(h,{})]})]})}const g=a(function(){return s.jsx(u,{})}),j=i(function({error:t}){let o="Oops!",n="An unexpected error occurred.",r;return d(t)&&(o=t.status===404?"404":"Error",n=t.status===404?"The requested page could not be found.":t.statusText||n),s.jsxs("main",{className:"pt-16 p-4 container mx-auto",children:[s.jsx("h1",{children:o}),s.jsx("p",{children:n}),r]})});export{j as ErrorBoundary,x as Layout,g as default,f as links};
