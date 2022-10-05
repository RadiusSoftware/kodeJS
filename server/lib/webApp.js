/*****
 * Copyright (c) 2017-2022 Christoph Wittmann, chris.wittmann@icloud.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*****/


/*****
 * A webapp is just one specific type of web extension and probably the most
 * frequencly employed.  A webapp is an extension with specific behavior: (1)
 * an undecorated GET results in responding with a dynamically built HTML doc,
 * (2) a GET with query parameters will be sent off to the handleGET() method
 * to handle, and (3) all POST querys will be passed on to the handlePOST()
 * method to be resolved.  To make a functioning webapp, an instance of a sub-
 * class needs to be made.  To make this happend, the subclass js module needs
 * to have a single export, and must look something like this:
 * 
 * exports = module.exports = new (class SubClass extends WebApp { ... } )();
 * 
 * During server bootstrapping, the module is loaded and a single instance of
 * the sub class is created.  Thereafter, that instance is used repeatedly for
 * handling HTTP and web socket requests.
*****/
register(class WebApp extends WebExtension {
    constructor() {
        super();
        this.authenticated = false;
        this.clientFramework = [];
        this.clientApplication = [];
        this.serverApplication = [];
    }

    async buildCss() {
        let minifyPath = PATH.join(env.nodeModulePath, 'minify/bin/minify.js');
        let cssPath = PATH.join(__dirname, 'webApp.css');
        return (await execShell(`node ${minifyPath} ${cssPath}`)).stdout.trim();
    }

    async buildDoc(req) {
        return htmlDocument(
            htmlElement('head'),
            htmlElement('body'),
        );
    }

    async handleGET(req) {
        return {
            mime: mkMime('text/plain'),
            data: '',
        };
    } 

    async handlePOST(req) {
        return {
            mime: mkMime('text/plain'),
            data: '',
        };
    }

    async handleHttpRequest(req) {
        if (req.method() == 'GET') {
            if (req.hasParameters()) {
                return await this.handleGET(req);
            }
            else {
                this.session = await Ipc.queryPrimary({ messageName: '#SentinelCreateSession' });
                let doc = await this.buildDoc(req);
                let html = Config.html == 'visual' ? doc.toVisual() : doc.toCompact();

                return {
                    mime: mkMime('text/html'),
                    data: html,
                };
            }
        }
        else if (req.method() == 'POST') {
            return await this.handlePOST(req);
        }
    }

    async init(module) {
        await super.init(module);
        this.css = await this.buildCss();
    }

    async onWebSocket(webSocket) {
    }
});
