/*****
 * Copyright (c) 2017-2022 Kode Programming
 * https://github.com/KodeProgramming/kode/blob/main/LICENSE
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
 * A class that encapsulates a single content object, which must be located at
 * a unique URL.  It's primary purpose is to support the HTTP server by serving
 * as an instance of data that can be fed via the HTTP server.  Each content
 * object contains additional meta data to facilitate content management.
*****/
class Resource {
    static formatters = {
        binary: buffer => buffer,
        string: buffer => buffer.toString(),
    };

    constructor(reference, module) {
        return new Promise(async (ok, fail) => {
            this.module = module;
            this.oneTime = false;
            this.url = reference.expandedUrl;
            this.value = null;
            this.reference = reference;
            this.tlsMode = reference.tlsMode ? reference.tlsMode : 'best';

            if ('path' in reference) {
                this.category = 'content';
                this.path = reference.expandedPath;
                this.mime = mkMime(PATH.extname(this.path));
            }
            else if ('webx' in reference) {
                this.category = 'webx';
                this.value = await module.mkWebx(reference);
            }
            else if ('hook' in reference) {
                this.category = 'hook';
            }
            else {
                logPrimary(`    WARNING: "Unable to process reference:\n.   reference: "${toJson(reference, true)}"`);
            }

            ok(this);
        });
    }

    async get(alg) {
        let value = this.value;

        if (value === null) {
            try {
                let buffer = await FILES.readFile(this.path);
                value = { '': Resource.formatters[this.mime.type](buffer) };

                if (Config.cache && buffer.length <= 1024*1024*Config.cacheMB) {
                    this.value = value;
                }
            } 
            catch (e) {
                return {
                    url: this.url,
                    mime: mkMime('text/plain'),
                    value: `ERROR: ${this.path}`,
                    error: true,
                };
            }
        }

        if (!(alg in value)) {
            value[alg] = await compress(alg, value['']);
        }

        return {
            url: this.url,
            mime: this.mime,
            value: value[alg],
            error: false,
        };
    }
}


/*****
 * A hook is a one-use pseudo resource generally used for special purposes. For
 * instance, we need a HookResource when performing ACME certification.  It can
 * also be used with designated single purpose dynamic links.  For instance, if
 * a user is provided an application URL, that URL can be a hook with a special
 * one-time purpose.  Keep in mind that hooks disappear after their one-time use
 * or after they expire.
*****/
register(class HookResource extends Jsonable {
    static nextHookId = 1;

    static init = (() => {
        Ipc.on('#HookResource.Accept', message => {
            if (message.hookId && message.url in ResourceLibrary.urls) {
                let hook = ResourceLibrary.urls[message.url].reference.hook;

                if (!hook.isStub) {
                    hook.accept(message.value);
                }
            }
        });

        Ipc.on('#HookResource.Clear', message => {
            if (message.hookId && message.url in ResourceLibrary.urls) {
                let hook = ResourceLibrary.urls[message.url].reference.hook;

                if (hook.stub) {
                    ResourceLibrary.deregister(message.url);
                }
            }
        });

        Ipc.on('#HookResource.Set', message => {
            if (message.hook.hookId  && !(message.url in ResourceLibrary.urls)) {
                mkHookResource(message.hook.url, message.hook);
            }
        });
    })();

    constructor(url, hook) {
        super();
        this.url = url;
        this.trigger = null;
        this.timeout = null;
        this.tlsMode = 'best';
        this.milliseconds = 0;

        if (hook) {
            this.stub = true;
            this.procId = hook.procId;
            this.hookId = hook.hookId;
            this.workerId = hook.workerId;
        }
        else {
            this.stub = false;
            this.procId = PROC.pid;
            this.hookId = `${PROC.pid}.${HookResource.nextHookId++}`;
            this.workerId = CLUSTER.worker.id;
        }

        if (!(this.url in ResourceLibrary.urls)) {
            ResourceLibrary.register({
                url: url,
                hook: this,
            });

            if (!(this.stub)) {
                Ipc.sendWorkers({
                    messageName: '#HookResource.Set',
                    hook: this,
                });
            }
        }
    }

    accept(value) {
        if (this.stub) {
            Ipc.sendWorker(this.workerId, {
                messageName: '#HookResource.Accept',
                url: this.url,
                procId: this.procId,
                hookId: this.hookId,
                value: value,
            });
        }
        else {
            this.clearTimeout();

            if (this.trigger) {
                this.trigger(value);
                this.trigger = null;
            }

            this.clear();
        }
    }

    clear() {
        if (!this.stub) {
            this.clearTimeout();

            Ipc.sendWorkers({
                messageName: '#HookResource.Clear',
                url: this.url,
                procId: this.procId,
                hookId: this.hookId,
            });

            ResourceLibrary.deregister(this.url);

            if (this.trigger) {
                this.trigger();
                this.trigger = null;
            }
        }
    }

    clearTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        return this;
    }

    get() {
        return new Promise((ok, fail) => {
            this.trigger = value => ok(value);
        });
    }

    setTlsMode(mode) {
        switch (mode) {
            case 'best':
            case 'none':
            case 'must':
                this.tlsMode = mode;
                break;
        }

        return this;
    }

    setTimeout(milliseconds) {
        if (this.timeout) {
            this.clearTimeout();
        }

        this.timeout = setTimeout(() => {
            this.clear();
        }, milliseconds);

        return this;
    }
});


/*****
 * Each process gets it's own singleton content object, which may be used by the
 * HTTP or any other server that needs to refer to content.  Each content item
 * has a unique URL.  On the aggregate level, the content from each module is
 * segregated to ensure unique URLs for each register content file.
*****/
singleton(class ResourceLibrary {
    constructor() {
        this.urls = {};
        this.builtin = false;
    }

    deregister(url) {
        for (let filtered of Object.keys(this.urls).filter(key => key.startsWith(url))) {
            delete this.urls[filtered];
        }
    }

    async expandReference(reference) {
        let expanded = [];

        if ('path' in reference) {
            let absPath = absolutePath(env.kodePath, reference.path);

            if (await pathExists(absPath)) {
                let stats = await FILES.stat(absPath);

                if (stats.isFile()) {
                    reference.expandedUrl = reference.url;
                    reference.expandedPath = absPath;
                    return [reference];
                }
                else if (stats.isDirectory()) {
                    for (let filePath of await recurseFiles(absPath)) {
                        let baseName = PATH.basename(filePath);
                        let relative = filePath.substr(reference.path.length);

                        if (!baseName.startsWith('.')) {
                            let expandedReference = clone(reference);
                            expandedReference.expandedUrl = PATH.join(reference.url, relative);
                            expandedReference.expandedPath = filePath;
                            expanded.push(expandedReference);
                        }
                    }

                    for (let dirPath of await recurseDirectories(absPath)) {
                        let indexPath = PATH.join(dirPath, 'index.html');

                        if (await pathExists(indexPath)) {
                            let stats = await FILES.stat(indexPath);

                            if (stats.isFile()) {
                                let expandedReference = clone(reference);
                                let relative = dirPath.substr(reference.path.length);
                                expandedReference.expandedUrl = PATH.join(reference.url, relative);
                                expandedReference.expandedPath = indexPath;
                                expanded.push(expandedReference);
                            }
                        }
                    }
                }
            }
            else {
                logPrimary(`    WARNING: "File Not Found"  PATH: "${reference.path}"`);
            }
        }
        else {
            reference.expandedUrl = reference.url;
            expanded.push(reference);
        }

        return expanded;
    }
    
    async get(url) {
        if (url in this.urls) {
            return await this.urls[url];;
        }
    }
    
    async register(reference, module) {
        for (let ref of await this.expandReference(reference)) {
            if (ref.expandedUrl in this.urls) {
                logPrimary(`    WARNING: "Duplicate URL ignored"  URL: "${ref.expandedUrl}"`);
            }
            else {
                let resource = await (new Resource(ref, module));
                this.urls[resource.url] = resource;
            }
        }
    }
});
