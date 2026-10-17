/**
 * ============================================================================
 * CustomDRACOLoader, createSkin, createSkinAnimation, geometryLoader
 * Ground-truth source from App3D.js: Lines 3841:134976 - 3841:148126
 * Offset range: [750350, 763500] (Length: 13150)
 * ============================================================================
 */
s,Zr,Ao;class CustomDRACOLoader{constructor(){oe(this,Zr);oe(this,ji,new Map);oe(this,qs,new FileLoader().setResponseType("arraybuffer"));oe(this,$s,new workerTask().setWorkerCreator(()=>new WorkerWrapper$6));oe(this,ds,"")}setPath(e){ze(this,ds,e),L(this,qs).setPath(L(this,ds))}loadAsync(e){if(L(this,ji).has(e))return L(this,ji).get(e);const i=new Promise((s,a)=>{L(this,qs).loadAsync(e).then(o=>L(this,$s).postMessage({url:`${L(this,ds)}${e}`,buffer:o},[o])).then(o=>{o.error?a(new Error(`buffer "${e}" could not be decoded.`)):s(Ee(this,Zr,Ao).call(this,o.geometry))}).catch(o=>{a(new Error(o))})});return L(this,ji).set(e,i),i}deleteFromCache(e){L(this,ji).delete(e)}dispose(){L(this,$s).dispose(),L(this,ji).forEach(e=>e.then(i=>i.dispose())),L(this,ji).clear()}}ji=new WeakMap,qs=new WeakMap,$s=new WeakMap,ds=new WeakMap,Zr=new WeakSet,Ao=function(e){const i=new BufferGeometry;e.userData&&(i.userData=e.userData),e.index&&i.setIndex(new BufferAttribute(e.index.array,1));for(let s=0;s<e.attributes.length;s++){const a=e.attributes[s],o=a.name,l=a.array,c=a.itemSize;i.setAttribute(o,new BufferAttribute(l,c))}return i};function WorkerWrapper$5(r){return new Worker("https://messenger.abeto.co/assets/geometryworker-WyEueJn9.js",{name:r==null?void 0:r.name})}var On,Kt,Yn,_o,Ua,Fa,io;let geometryProcessor$1=(io=class{constructor(){oe(this,Kt);oe(this,On,new workerTask().setWorkerCreator(()=>new WorkerWrapper$5))}batched(e){if(!e.isBufferGeometry)throw new Error("geometryProcessor.batched: geometry is not a BufferGeometry");const{attribs:i,transfers:s}=Ee(this,Kt,Yn).call(this,e);return L(this,On).postMessage({action:"batched",attributes:i},s).then(a=>{const o=[];for(let l=0;l<a.result.length;l++){const c=a.result[l];o.push(Ee(this,Kt,_o).call(this,c))}return o})}instanced(e,i){if(!e.isBufferGeometry||!i.isBufferGeometry)throw new Error("geometryProcessor.instanced: geometries are not a BufferGeometry");const s=Ee(this,Kt,Yn).call(this,e),a=Ee(this,Kt,Yn).call(this,i);return L(this,On).postMessage({action:"instanced",attributes:s.attribs,attributesInstanced:a.attribs},[...s.transfers,...a.transfers]).then(o=>{const l=o.result,c=Ee(this,Kt,Ua).call(this,l);return Ee(this,Kt,Fa).call(this,e,c),c})}instancedPatches(e,i){if(!e.isBufferGeometry||!i.isBufferGeometry)throw new Error("geometryProcessor.instanced: geometries are not a BufferGeometry");const s=Ee(this,Kt,Yn).call(this,e),a=Ee(this,Kt,Yn).call(this,i);return L(this,On).postMessage({action:"instancedPatches",attributes:s.attribs,attributesInstanced:a.attribs},[...s.transfers,...a.transfers]).then(o=>{const l=[];for(let c=0;c<o.result.length;c++){const h=o.result[c],d=Ee(this,Kt,Ua).call(this,h);Ee(this,Kt,Fa).call(this,e,d),l.push(d)}return l})}dispose(){L(this,On).dispose()}},On=new WeakMap,Kt=new WeakSet,Yn=function(e){const i={},s=[];if(e.getIndex()){const a=e.getIndex();i.index={array:a.array,itemSize:a.itemSize,normalized:a.normalized},s.push(a.array.buffer)}for(const a in e.attributes){const o=e.getAttribute(a);i[a]={array:o.array,itemSize:o.itemSize,normalized:o.normalized},s.push(i[a].array.buffer)}return{attribs:i,transfers:s,userData:e.userData}},_o=function(e){const i=new BufferGeometry;for(const s in e)if(s==="userData")i.userData=e.userData;else{const a=e[s];s==="index"?i.setIndex(new BufferAttribute(a.array,a.itemSize,a.normalized)):i.setAttribute(s,new BufferAttribute(a.array,a.itemSize,a.normalized))}return i},Ua=function(e){const i=new InstancedBufferGeometry;for(const s in e)if(s==="userData")i.userData=e.userData;else if(s==="instanceCount")i.instanceCount=e.instanceCount;else if(s==="matrixArray")i._matrixArray=e[s];else{const a=e[s];s==="index"?i.setIndex(new BufferAttribute(a.array,a.itemSize,a.normalized)):i.setAttribute(s,new(a.isInstanced?InstancedBufferAttribute:BufferAttribute)(a.array,a.itemSize,a.normalized))}return i},Fa=function(e,i){e.__vertexAnimationUniforms&&(i.__vertexAnimationUniforms=e.__vertexAnimationUniforms)},io);function capitalizeFirstLetter(r){return r.charAt(0).toUpperCase()+r.slice(1)}function createVertexAnimation(r){const e=r.userData,i=Object.keys(r.attributes),s=i.filter(c=>c.slice(-2)==="_1").map(c=>c.substring(0,c.length-2)),a=i.filter(c=>c.slice(-2)==="_2").map(c=>c.substring(0,c.length-2)),o=new BufferGeometry;r.index&&o.setIndex(r.index.clone()),s.forEach(c=>{o.setAttribute(c,r.attributes[`${c}_1`].clone())});const l={};if(a.length>0){const c=r.attributes[`${a[0]}_1`].count,h=c*e.frames,d=math.getTextureSizeParticles(h),p=d*d;l.uAnimInfo={value:new Vector3(e.fps,e.frames,c),ignore:!0};const f=new Float32Array(c);for(let _=0;_<f.length;_++)f[_]=_;o.setAttribute("vposition",new BufferAttribute(f,1)),a.forEach(_=>{const x=new Float32Array(p*4);for(let T=0;T<e.frames;T++){const M=r.attributes[`${_}_${T+1}`].array;for(let w=0;w<c;w++){const D=T*c*4+w*4,R=w*3;x[D+0]=M[R+0],x[D+1]=M[R+1],x[D+2]=M[R+2],x[D+3]=1}}const b=new DataTexture(x,d,d,RGBAFormat,FloatType);b.needsUpdate=!0,l[`t${capitalizeFirstLetter(_)}`]={value:b}})}return o.__vertexAnimationUniforms=l,o}function createCurves(r,e,i){const s=[];return Object.values(r.attributes).forEach(o=>{const l=o.count,c=o.array,h=[];for(let f=0;f<l;f++)h.push(new Vector3(c[f*3+0],c[f*3+1],c[f*3+2]));const d=new CurvePath;for(let f=0;f<h.length-1;f++)d.add(new LineCurve3(h[f],h[f+1]));i&&(d.autoClose=!0);const p=d.getPoints(Math.round(d.getLength()*10*e));s.push({curve:d,geometry:new BufferGeometry().setFromPoints(p)})}),s}const defaultMaterial=new MeshNormalMaterial;function createSkin(r,e){const i=[];for(let l=0;l<e.attributes.position.count;l++){const c=new Bone;c.name=`bone_${l}`,c.position.fromArray(e.attributes.position.array,l*3),c.quaternion.fromArray(e.attributes.quaternion.array,l*4).normalize(),c.scale.fromArray(e.attributes.scale.array,l*3),i.push(c)}const s=[];for(let l=0;l<e.attributes.hierarchy.count;l++){const c=e.attributes.hierarchy.array[l]-1;c===-1?s.push(l):i[c].add(i[l])}const a=new Skeleton(i),o=new SkinnedMesh(r,defaultMaterial);return s.forEach(l=>o.add(a.bones[l])),o.bind(a),o.normalizeSkinWeights(),o}function WorkerWrapper$4(r){return new Worker("https://messenger.abeto.co/assets/msdfworker-DGxypdow.js",{name:r==null?void 0:r.name})}class MSDFLoader{constructor(){this.jsonLoader=new FileLoader,this.jsonCache=new Map,this.workerTask=new workerTask().setWorkerCreator(()=>new WorkerWrapper$4)}loadAsync(e){return new Promise(async i=>{if(!e.font)throw new Error("You must specify a MSDF font.");const s=e.font;this.jsonCache.has(s)||this.jsonCache.set(s,new Promise(async l=>{try{const c=JSON.parse(await this.jsonLoader.loadAsync(`${e.font}.json`)),h=c.glyphs;c.glyphs={},h.forEach(d=>{const p=String.fromCharCode(d.unicode);d.isWhitespace=/\s/.test(p),c.glyphs[p]=d}),c.placeholderChar=Object.keys(c.glyphs).sort()[0],l(c)}catch(c){console.log("Error loading msdf json:",c),l(!1)}}));const a=new BufferGeometry,o=await this.jsonCache.get(s);if(o){const l=(await this.workerTask.postMessage({font:o,options:e})).buffers;a.setIndex(new BufferAttribute(l.index,1)),a.setAttribute("position",new BufferAttribute(l.position,3)),a.setAttribute("uv",new BufferAttribute(l.uv,2)),a.setAttribute("uvMask",new BufferAttribute(l.uvMask,4)),a.setAttribute("textWeights",new BufferAttribute(l.textWeights,2)),a.setAttribute("lineWeights",new BufferAttribute(l.lineWeights,3)),a.setAttribute("centr",new BufferAttribute(l.centr,3)),a._maxLineHeight=l.maxLineHeight,a._maxUVDisp=l.maxUVDisp,a._sizes=l.sizes}else a._maxLineHeight=0,a._maxUVDisp=0,a._sizes={width:0,height:0};i(a)})}setPath(e){this.jsonLoader.setPath(e)}dispose(){this.workerTask.dispose(),this.jsonCache.clear()}}const animationAttributes=["scale","quaternion","position"],_v1$d=new Vector3,_q1$1=new Quaternion,_q2=new Quaternion,_qCam=new Quaternion,_qIdentity=new Quaternion;class pointAnimation{constructor(e){const i=e.userData;this._frames=i.frames,this._fps=i.fps,this._duration=this._frames/this._fps,this._attribs=e.attributes,this._camTargetDistance=1,this._object=null,this._animationVar=0,this._animation=createTween(this,{to:{_animationVar:1},duration:this._duration,ease:"none",paused:!0,onUpdate:this._onUpdate.bind(this)})}_onUpdate(){if(!this._object)return;const e=this._frames-1,i=math.clamp(e*this._animationVar,0,e),s=Math.floor(i),a=Math.ceil(i),o=Math.abs(i-s);this._object.isCamera&&_qCam.identity(),animationAttributes.forEach(l=>{const c=this._attribs[l];if(!(!c||!this._object[l])&&!(this._object.isCamera&&l==="scale"))switch(l){case"scale":c.itemSize===1?this._object.scale.setScalar(math.lerp(c.array[s],c.array[a],o)):this._object.scale.fromArray(c.array,s*3).lerp(_v1$d.fromArray(c.array,a*3),o);break;case"quaternion":_q1$1.fromArray(c.array,s*4).normalize(),_q2.fromArray(c.array,a*4).normalize(),_q1$1.slerp(_q2,o),this._object.isCamera?_qCam.copy(_q1$1):this._object.quaternion.copy(_q1$1);break;case"position":this._object[this._object.isCamera?"basePosition":"position"].fromArray(c.array,s*3).lerp(_v1$d.fromArray(c.array,a*3),o);break}}),this._object.isCamera&&!_qCam.equals(_qIdentity)&&(this._object.baseTarget.set(0,0,-this._camTargetDistance).applyQuaternion(_qCam).add(this._object.basePosition),this._object.baseUp.set(0,1,0).applyQuaternion(_qCam))}use(e,i=!0){return this._object=e,this._object.isCamera&&i&&(this._camTargetDistance=_v1$d.copy(this._object.baseTarget).sub(this._object.basePosition).length()),this.progress(0)}play(){return this._animation.play()}pause(){return this._animation.pause()}progress(e=0){return this._animation.progress(e)}restart(){return this._animation.restart()}dispose(){this._animation.kill(),this._object=null}}const _v0$k=new Vector3,_q0$4=new Quaternion;function createSkinAnimation(r,e){if(!Object.hasOwn(e.userData,"frames")||!Object.hasOwn(e.userData,"fps"))return new AnimationClip(r,0,[]);const i=e.userData,s=i.frames,a=e.attributes.position.count/s,o=s/i.fps,l=o/(s-1),c=new Array(s).fill(0).map((f,_)=>_*l),h={};["position","quaternion","scale"].forEach(f=>{const _=e.attributes[f].array,x=e.attributes[f].itemSize,b=x===4?_q0$4:_v0$k;for(let T=0;T<a;T++){const M=`bone_${T}.${f}`;h[M]={size:x,arr:[]};const w=T*x;for(let D=0;D<s;D++)b.fromArray(_,D*a*x+w),x===4&&b.normalize(),h[M].arr.push(...b.toArray())}});const d=[];return Object.keys(h).forEach(f=>{const _=h[f].size===4?QuaternionKeyframeTrack:VectorKeyframeTrack;d.push(new _(f,c,h[f].arr,InterpolateLinear))}),new AnimationClip(r,o,d)}const bufferGeometryLoader=new BufferGeometryLoader,customDracoLoader=new CustomDRACOLoader,msdfLoader=new MSDFLoader,geometryProcessor=new geometryProcessor$1,fallbackGeometry=new BoxGeometry(.5,.5,.5),geometryLoader={_geometryCache:new Map,_initLoad(r,e){return this._geometryCache.has(r)||this._geometryCache.set(r,new Promise(e)),this._geometryCache.get(r)},load(r,e=!1){return this._initLoad(r,async i=>{const s=r.split(".").pop();let a=null;try{s.startsWith("drc")||s.startsWith("bin")?a=await customDracoLoader.loadAsync(r):a=await bufferGeometryLoader.loadAsync(r),i(a)}catch(o){console.log("Geometry loader",o),i(fallbackGeometry)}e||(customDracoLoader.deleteFromCache(r),deleteFromCache$1(r))})},instanced(r,e,i="load",s=!1){const a=`instanced_<>_${r}-${e}`;return this._initLoad(a,async o=>{const[l,c]=await Promise.all([this[i](r,!1),this.load(e,!1)]),h=await geometryProcessor.instanced(l,c);o(h),s||deleteFromCache$1(a)})},instancedPatches(r,e,i="load",s=!1){const a=`instancedPatches_<>_${r}-${e}`;return this._initLoad(a,async o=>{const[l,c]=await Promise.all([this[i](r,!1),this.load(e,!1)]),h=await geometryProcessor.instancedPatches(l,c);o(h),s||deleteFromCache$1(a)})},batched(r,e=!1){const i=`batched_<>_${r}`;return this._initLoad(i,async s=>{const a=await this.load(r,!1),o=await geometryProcessor.batched(a);s(o),e||deleteFromCache$1(i)})},vertexAnimation(r,e=!1){const i=`vertexanimation_<>_${r}`;return this._initLoad(i,async s=>{const a=await this.load(r,!1);s(createVertexAnimation(a)),e||deleteFromCache$1(i)})},curves(r,e=!1,i=1,s=!1){const a=`curves_<>_${r}_${e}_${i}`;return this._initLoad(a,async o=>{const l=await this.load(r,!1);o(createCurves(l,i,e)),s||deleteFromCache$1(a)})},pointAnimation(r,e=!1){const i=`pointanimation_<>_${r}`;return this._initLoad(i,async s=>{const a=await this.load(r,!1);s(new pointAnimation(a)),e||deleteFromCache$1(i)})},skin(r,e,i=!1){const s=`skin_<>_${r}-${e}`;return this._initLoad(`skin_<>_${r}-${e}`,async a=>{const[o,l]=await Promise.all([this.load(r,!1),this.load(e,!1)]);a(createSkin(o,l)),i||deleteFromCache$1(s)})},skinAnimation(r,e=!1){const i=`skinanimation_<>_${r}`;return this._initLoad(i,async s=>{const a=await this.load(r,!1);s(createSkinAnimation(r,a)),e||deleteFromCache$1(i)})},msdf(r){return msdfLoader.loadAsync(r)}};function deleteFromCache$1(){for(const r of arguments)geometryLoader._geometryCache.delete(r)}function createInstancedGeometryPatches(r,e){return geometryProcessor.instancedPatches(r,e)}function setGeometryPath(){bufferGeometryLoader.setPath(`${client$1.absolutePath}/assets/geometries/`),customDracoLoader.setPath(`${client$1.absolutePath}/assets/geometries/`),msdfLoader.setPath(`${client$1.absolutePath}/assets/fonts/`)}f


/**
 * ============================================================================
 * textureLoader & Basis / KTX2 texture management
 * Ground-truth source from App3D.js: Lines 3842:15757 - 3842:19617
 * Offset range: [828140, 832000] (Length: 3860)
 * ============================================================================
 */
x2",textureLoader={_texturesCache:new Map,load(r=DEFAULT_TEXTURE,e="default",i=!0){const s=`${r}_<>_${e}`;if(this._texturesCache.has(s))return this._texturesCache.get(s);const a=r.split(".").pop(),o=e.toLowerCase();let l=null,c=null;a.startsWith("ktx2")?(l=TEXTURE_FORMATS.KTX2,o.includes("cubemap")?c=new CompressedCubeTexture:o.includes("3d")||o.includes("lut")?c=new Data3DTexture:o.includes("data")?c=new DataTexture:c=new CompressedTexture):a.startsWith("exr")?(l=TEXTURE_FORMATS.EXR,c=new DataTexture):a.startsWith("mp4")||a.startsWith("webm")?(l=TEXTURE_FORMATS.VIDEO,c=new CustomVideoTexture(`${client$1.absolutePath}/assets/${r}`,o.includes("autoplay"))):(client$1.capabilities.imageBitmap&&BITMAP_EXTENSIONS.some(f=>a.startsWith(f))?l=TEXTURE_FORMATS.BITMAP:l=TEXTURE_FORMATS.IMAGE,c=new Texture),c._url=r,c._loadMode=e,makeTextureAwaitable(c);const d=o.includes("srgb")||r===DEFAULT_TEXTURE?SRGBColorSpace:c.colorSpace;c.colorSpace=d;const p=!o.includes("noflip");return this._texturesCache.set(s,c),setTimeout(async()=>{let f=null;try{l===TEXTURE_FORMATS.KTX2?f=await ktx2Loader.loadAsync(r):l===TEXTURE_FORMATS.EXR?f=await exrLoader.loadAsync(r):l===TEXTURE_FORMATS.VIDEO?(f=c)&&await c._videoLoadAsync:l===TEXTURE_FORMATS.BITMAP?f=await bitmapLoader.loadAsync(r,p):f=await basicLoader.loadAsync(r)}catch(_){console.warn("Texture load:",_,r),l!==TEXTURE_FORMATS.EXR&&l!==TEXTURE_FORMATS.VIDEO&&!c.isData3DTexture&&(c.colorSpace=SRGBColorSpace,l===TEXTURE_FORMATS.KTX2?f=await ktx2Loader.loadAsync(DEFAULT_TEXTURE_KTX2):l===TEXTURE_FORMATS.BITMAP?f=await bitmapLoader.loadAsync(DEFAULT_TEXTURE):(l=TEXTURE_FORMATS.IMAGE,f=await basicLoader.loadAsync(DEFAULT_TEXTURE_KTX2)))}c!==f&&(c.dispose(),c.copy(f)),o.includes("repeat")&&(o.includes("mirror")?(c.wrapS=MirroredRepeatWrapping,c.wrapT=MirroredRepeatWrapping):(c.wrapS=RepeatWrapping,c.wrapT=RepeatWrapping)),o.includes("lut")?o.includes("luttetrahedral")?(c.magFilter=NearestFilter,c.minFilter=NearestFilter):(c.magFilter=LinearFilter,c.minFilter=LinearFilter):o.includes("data")||o.includes("linearfilter")?(c.magFilter=LinearFilter,c.minFilter=LinearFilter):o.includes("nearest")&&(c.magFilter=NearestFilter,c.minFilter=NearestFilter),(o.includes("nearest")||o.includes("data")||o.includes("nomipmaps"))&&(c.generateMipmaps=!1),o.includes("pmrem")&&(o.includes("refraction")?c.mapping=EquirectangularRefractionMapping:c.mapping=EquirectangularReflectionMapping),c.colorSpace=d,c.needsUpdate=!0,c._loaded.resolve(c),i||deleteFromCache(r,p,s)},0),c},loadCurves(r,e=!1,i=1,s=!0){const a=`curves_${r}_<>_${e}_<>_${i}`;if(this._texturesCache.has(a))return this._texturesCache.get(a);const o=createCurvesTexture(r,e,i);return this._texturesCache.set(a,o),o._loaded.then(()=>{s||this._texturesCache.delete(a)}),o}};function makeTextureAwaitable(r){const e=miscutils.deferred(),i=e.resolve;e.resolve=s=>{delete r.then,i(s)},r._loaded=e,r.then=(s,a)=>r._loaded.then(s,a)}function deleteFromCache(r,e,i){bitmapLoader.deleteFromCache(r,e),exrLoader.deleteFromCache(r),textureLoader._texturesCache.delete(i)}function setTexturesPath(){ktx2Loader.setTranscoderPath(`${client$1.absolutePath}/assets/libs/basis/`),ktx2Loader.setPath(`${client$1.absolutePath}/assets/images/`),bitmapLoader.setPath(`${client$1.absolutePath}/assets/images/`),exrLoader.setPath(`${client$1.absolutePath}/assets/images/`),basicLoader.setPath(`${client$1.absolutePath}/assets/images/`)}function disposeTextures(){const r=ktx2Loader.workerSourceURL;ktx2Loader.workerSourceURL="",ktx2Loader.dispose(),ktx2Loader.workerSourceURL=r,bitmapLoader.dispose(),exrLoader.dispose(),textureLoader._texturesCache.clear()}function mergeGeometries(r,e=!1){const i=r[0].index!==null,s=new Set(Object.keys(r[0].attributes)),a=new Set(Object.keys(r[0].morphAttributes)),o={},l={},c=r[0].morphTargetsRelative,h=new BufferGeometry;let d=0;for(let p=


/**
 * ============================================================================
 * baseMaterial, vertex & fragment shaders, atlas and noise textures
 * Ground-truth source from App3D.js: Lines 9139:1523 - 9367:3848
 * Offset range: [1608000, 1622320] (Length: 14320)
 * ============================================================================
 */
];async function introDialogue(){for(let r=0;r<introTexts.length;r++){const e=miscutils.deferred();events$1.once("npc_force_next_dialog",i=>{e.resolve()}),events$1.emit("npc_dialog_open","intro_sequence",introTexts[r],introData,{}),await e,events$1.emit("npc_dialog_close","intro_sequence"),await miscutils.wait(.3)}events$1.emit("npc_dialog_finished","intro_sequence")}const _v0$a=new Vector3,EMOJI_MAP={1:2,2:0,3:1,4:8,5:5,6:6,7:7,8:9,9:3,0:4};let emojis$1=class{constructor({scene:e,characters:i}={}){this.scene=e,this.characters=i,this.ready=miscutils.deferred(),this.numEmojis=10,this.maxDistance=20,this.rateLimit=.35,this.init()}async init(){this.mesh=new batchedGPU({maxInstanceCount:64,maxVertexCount:300,maxIndexCount:4,material:new ShaderMaterial({name:"emojis",lights:!0,userData:{hotReload:"emojis"},uniformsGroups:[global$1.UBO],uniforms:{...UniformsUtils.clone(UniformsLib.common),...UniformsUtils.clone(UniformsLib.lights),batchingTexture:{value:null},batchingIdTexture:{value:null},tTexture1:{value:null},tTexture2:{value:null},tTexture3:{value:null},tAtlas:{value:textureLoader.load("atlas.png","srgb-nearest")},...fogUniforms},vertexShader:`
                /* BATCHING */
                #if ! defined(GL_ANGLE_multi_draw)
                    #define gl_DrawID _gl_DrawID
                    uniform int _gl_DrawID;
                #endif

                attribute int emoji;
                attribute float surfaceId;

                ${matrixutils_default}
                ${rotate_default}
                ${globalUBO_default}

                uniform sampler2D tTexture1;
                uniform sampler2D tTexture2;
                uniform sampler2D tTexture3;

                uniform highp usampler2D batchingIdTexture;

                vec4 getInfo(const in sampler2D map, const in int i) {
                    int size = textureSize(map, 0).x;
                    return texelFetch(map, ivec2(i % size, i / size), 0);
                }

                float getIndirectIndex(const in int i) {
                    int size = textureSize(batchingIdTexture, 0).x;
                    return float(texelFetch(batchingIdTexture, ivec2(i % size, i / size), 0).r);
                }

                varying vec2 vUv;
                varying vec3 lPos;
                varying vec4 vPos;
                varying vec3 vNormal;
                flat varying vec3 vLightDir;
                flat varying float vScale;
                flat varying float vRand;
                flat varying float vSurfaceId;
                varying vec2 vHighPrecisionZW;

                // for light direction
                struct DirectionalLight {
                    vec3 direction;
                    vec3 color;
                };
                uniform DirectionalLight directionalLights[ 1 ];

                // for shadows
                #include <shadowmap_pars_vertex>
                vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
                    return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
                }

                void main() {
                    vUv = uv;
                    lPos = position;
                    vSurfaceId = surfaceId;

                    vLightDir = vec3(0.0);
                    #if NUM_DIR_LIGHTS > 0
                        vLightDir = normalize(directionalLights[0].direction);
                    #endif

                    int batchID = int(getIndirectIndex(gl_DrawID));
                    vec4 info1 = getInfo(tTexture1, batchID);
                    vec3 offset = info1.rgb;
                    float life = info1.a;

                    vec4 info2 = getInfo(tTexture2, batchID);
                    vRand = info2.a;

                    vec4 info3 = getInfo(tTexture3, batchID);
                    vec3 up = info3.rgb;

                    // tweak scale based on life
                    vScale = smoothstep(0.0, 0.15, life) * smoothstep(1.0, 0.7, life);

                    // rotate position according to the planet
                    mat4 planetRot = getMatrixRotation(viewMatrix);
                    vec3 pos = (vec4(position, 1.0) * planetRot).xyz;

                    // rotate around up vector
                    mat4 rot = rotation3D(up, time * 1.5 + (vRand + float(emoji)) * 32.2432);

                    // calculate world position and normal
                    vec3 wPos = offset + (rot * vec4(pos * vScale, 1.0)).xyz;
                    vNormal = normalize(normalMatrix * (rot * (vec4(normal, 0.0) * planetRot)).xyz);

                    vPos = viewMatrix * vec4(wPos, 1.0);

                    gl_Position = projectionMatrix * vPos;
                    vHighPrecisionZW = gl_Position.zw;

                    // this requires worldPosition and transformedNormal
                    vec3 transformedNormal = vNormal;
                    vec4 worldPosition = vec4(wPos, 1.0);
                    #include <shadowmap_vertex>
                }
            `,fragmentShader:`
                layout(location = 1) out highp vec4 gInfo;

                ${encoding_default}
                ${colorutils_default}
                ${sinenoise_default}
                ${fog_default}

                uniform sampler2D tEmojis;
                uniform sampler2D tAtlas;

                varying vec2 vUv;
                varying vec3 lPos;
                varying vec4 vPos;
                varying vec3 vNormal;
                flat varying vec3 vLightDir;
                flat varying float vScale;
                flat varying float vRand;
                flat varying float vSurfaceId;
                varying vec2 vHighPrecisionZW;

                // for shadows
                #include <packing>
                #include <shadowmap_pars_fragment>

                void main() {

                    vec3 geometryNormal = normalize(vNormal);
                    float light = dot(geometryNormal, normalize(vLightDir));

                    // shadow
                    float shadow = 0.0;
                    #if defined(USE_SHADOWMAP) && NUM_DIR_LIGHT_SHADOWS > 0
                        DirectionalLightShadow directionalLightShadow;
                        directionalLightShadow = directionalLightShadows[0];
                        shadow = getShadow(
                            directionalShadowMap[0],
                            directionalLightShadow.shadowMapSize,
                            directionalLightShadow.shadowIntensity,
                            directionalLightShadow.shadowBias,
                            directionalLightShadow.shadowRadius,
                            vDirectionalShadowCoord[0]
                        );
                    #endif

                    light = min(light, shadow);

                    // set color
                    vec3 color = texture2D(tAtlas, vUv).rgb;
                    vec3 colorShadow = rgb2hsv(color);
                    colorShadow.r -= 0.02;
                    colorShadow.b *= 0.5;
                    colorShadow = hsv2rgb(colorShadow);
                    float shadowCut = smoothstep(0.2, 0.4, light);
                    color = mix(colorShadow, color, shadowCut);

                    addFog(color, vPos.z);

                    gl_FragColor = vec4(color, vSurfaceId);

                    float outlineNoise = sinenoise1(lPos * 25.0 + vec3(3.324, 34.2, 56.343) * vRand) * 0.5 + 0.5;
                    float contribution = step(0.3, outlineNoise);
                    gInfo = vec4(1.0 - (0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5), encodeNormalSpheremap(geometryNormal), contribution);
                }
            `})},{textures:3}),this.mesh.customDepthMaterial=new ShaderMaterial({uniforms:{batchingTexture:{value:null},batchingIdTexture:{value:null},tTexture1:{value:null},tTexture2:{value:null},tTexture3:{value:null}},vertexShader:`
                /* BATCHING */
                #if ! defined(GL_ANGLE_multi_draw)
                    #define gl_DrawID _gl_DrawID
                    uniform int _gl_DrawID;
                #endif

                ${matrixutils_default}
                ${rotate_default}
                ${globalUBO_default}

                attribute int emoji;

                uniform sampler2D tTexture1;
                uniform sampler2D tTexture2;
                uniform sampler2D tTexture3;

                uniform highp usampler2D batchingIdTexture;

                vec4 getInfo(const in sampler2D map, const in int i) {
                    int size = textureSize(map, 0).x;
                    return texelFetch(map, ivec2(i % size, i / size), 0);
                }

                float getIndirectIndex(const in int i) {
                    int size = textureSize(batchingIdTexture, 0).x;
                    return float(texelFetch(batchingIdTexture, ivec2(i % size, i / size), 0).r);
                }

                varying vec2 vHighPrecisionZW;

                void main() {
                    int batchID = int(getIndirectIndex(gl_DrawID));
                    vec4 info1 = getInfo(tTexture1, batchID);
                    vec3 offset = info1.rgb;
                    float life = info1.a;

                    vec4 info2 = getInfo(tTexture2, batchID);
                    float randd = info2.a;

                    vec4 info3 = getInfo(tTexture3, batchID);
                    vec3 up = info3.rgb;

                    // tweak scale based on life
                    float scale = smoothstep(0.0, 0.15, life) * smoothstep(1.0, 0.7, life);

                    // rotate position according to the planet
                    mat4 planetRot = getMatrixRotation(viewMatrix);
                    vec3 pos = (vec4(position, 1.0) * planetRot).xyz;

                    // rotate around up vector
                    mat4 rot = rotation3D(up, time * 1.5 + (randd + float(emoji)) * 32.2432);

                    // calculate world position and normal
                    vec3 wPos = offset + (rot * vec4(pos * scale, 1.0)).xyz;

                    gl_Position = projectionMatrix * viewMatrix * vec4(wPos, 1.0);
                    vHighPrecisionZW = gl_Position.zw;
                }
            `,fragmentShader:`
                #include <packing>
                varying vec2 vHighPrecisionZW;
                void main() {
                    float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
                    gl_FragColor = packDepthToRGBA( fragCoordZ );
                }
            `}),this.mesh.name="Emojis",this.mesh.castShadow=!0,this.mesh.receiveShadow=!0;const e=this.mesh.customDepthMaterial.uniforms,i=this.mesh.material.uniforms;this.scene.beforeRenderCbs.push(()=>{e.batchingTexture.value=i.batchingTexture.value,e.batchingIdTexture.value=i.batchingIdTexture.value,e.tTexture1.value=i.tTexture1.value,e.tTexture2.value=i.tTexture2.value,e.tTexture3.value=i.tTexture3.value}),(await Promise.all(Array.from({length:this.numEmojis},(a,o)=>geometryLoader.load(`emojis/${o+1}.drc`)))).forEach((a,o)=>{const l=a.clone();l.setAttribute("emoji",new BufferAttribute(new Int32Array(new Array(l.attributes.position.count).fill(o)),1)),this.mesh.addGeometry(l)}),this.scene.add(this.mesh),events$1.on("character_emoji_display",this.onCharacterEmojiDisplay,this),events$1.on("character_network_event",this.onCharacterNetworkEvent,this),events$1.on("keydown",this.onKeyDown,this),this.ready.resolve()}onKeyDown(e){const i=parseInt(e.key);isNaN(i)||i<0||i>this.numEmojis||typeof EMOJI_MAP[i]=="number"&&events$1.emit("character_emoji_display",EMOJI_MAP[i])}onCharacterEmojiDisplay(e=0){typeof e!="number"||e<0||this.characters._emitNetworkEvent(`emoji:${e}`)}onCharacterNetworkEvent({object:e,index:i,id:s,event:a}){if(!a.startsWith("emoji"))return;const o=a.split(":");if(o.length!==2)return;const l=parseInt(o[1]);if(typeof l!="number"||l<0||l>=this.numEmojis||!e||!e.position)return;const c=e.position.distanceTo(this.characters._localObject.position);if(c>this.maxDistance||(e.__lastEmojiShown||(e.__lastEmojiShown=-1),renderInfo.time-e.__lastEmojiShown<this.rateLimit)||(e.__lastEmojiShown=renderInfo.time,e.scale.x<1))return;const h=math.mix(.8,1,Math.random()),d=_v0$a.copy(e.position).addScaledVector(e.up,e.boundingSphere.radius*1.05).toArray();e===this.characters._localObject&&this.characters._setActive();const p=3;c<p&&(events$1.emit("webgl_play_audio",`emoji-starts${Math.floor(Math.random()*3)+1}`),createDelayedCall(1.4*h,()=>{_v0$a.fromArray(d).distanceTo(this.characters._localObject.position)<p&&events$1.emit("webgl_play_audio",`emoji-ends${Math.floor(Math.random()*3)+1}`)})),this.mesh.spawn({geometryID:l,expiration:2,data:[d,h,_v0$a.copy(e.up).multiplyScalar(.02).toArray(),Math.random(),e.up.toArray()]})}dispose(){events$1.off("character_emoji_display",this.onCharacterEmojiDisplay,this),events$1.off("character_network_event",this.onCharacterNetworkEvent,this)}};function baseMaterial(r={}){const e={},i=new ShaderMaterial({name:"base",defines:e,uniformsGroups:[global$1.UBO],uniforms:UniformsUtils.clone(uniforms),vertexShader:vertex,fragmentShader:fragment,lights:!0});return e.USE_UV=!0,i.uniforms.tColors.value=textureLoader.load("atlas.png","srgb-nearest"),i.uniforms.tNoise.value=textureLoader.load("noise-simplex-layered-pixellated-highq.ktx2","linearfilter-repeat"),i.uniforms.tNoiseTerrain.value=textureLoader.load("noises-terrain.ktx2","linearfilter-repeat"),(r.isTerrain||r.frontShadow)&&(e.IS_TERRAIN=!0,i.shadowSide=FrontSide),r.isCharacters&&(e.IS_CHARACTER=1,e.USE_SKINNING=1,e.HARD_CUT_SHADOW=!0,i.shadowSide=FrontSide,i.uniforms.boneTexture={value:null},i.uniforms.batchingTexture={value:null},i.uniforms.batchingIdTexture={value:null},i.uniforms.uWetHeight={value:0},i.uniforms.tEye={value:textureLoader.load("mainchar-eye-highq.ktx2","repeat")}),r.isNPC&&(e.IS_NPC=1,e.HARD_CUT_SHADOW=!0,i.uniforms.tEye={value:textureLoader.load("eye-highq.ktx2","repeat")},i.uniforms.uNPCSeed={value:Math.random()},i.uniforms.tMouth={value:textureLoader.load("mouth-highq.ktx2","repeat")},i.uniforms.uMouthColor={value:new Color("#2f1013")},i.uniforms.uIsTalking={value:0}),(r.isCharacters||r.isNPC)&&(i.uniforms.uSkinColor={value:new Color("#ebced0")}),r.isGive&&(e.IS_GIVE=1),i}const _v0$9=new Vector3,_v1$6=new Vector3,_v2=new Vector3,_q0$2=new Quaternion;class emojis{constructor({scene:e


/**
 * ============================================================================
 * class terrain, BatchedMesh, LOD chunks full_0..9
 * Ground-truth source from App3D.js: Lines 9418:11441 - 9418:15491
 * Offset range: [1640950, 1645000] (Length: 4050)
 * ============================================================================
 */
);break}}class terrain{constructor(e,i){this.scene=e,this.options=i,this.extraLODs=0,this.lowMemory=!!client$1.lowMemoryDevice,this.DOT_THRESHOLD=.45,this.LOD1_THRESHOLD=6,this.LOD2_THRESHOLD=12,this.LOD3_THRESHOLD=this.lowMemory?1/0:20,this.ready=new Promise(s=>{this.isReady=s}),this.init()}async init(){const e=Array.from({length:this.options.chunks},(_,x)=>x);let i=null,s=null,a=null,o=null,l=null;this.lowMemory?(i=await Promise.all([await Promise.all(e.map(_=>geometryLoader.batched(`planets/${this.scene.terrainOptions.terrain}/low/full_${_}.drc`))),await Promise.all(e.map(_=>geometryLoader.batched(`planets/${this.scene.terrainOptions.terrain}/low/full-lod-1_${_}.drc`))),await Promise.all(e.map(_=>geometryLoader.batched(`planets/${this.scene.terrainOptions.terrain}/low/full-lod-3_${_}.drc`)))]),s=i[0].flat(),a=i[1].flat(),o=i[2].flat()):(i=await Promise.all([await Promise.all(e.map(_=>geometryLoader.batched(`planets/${this.scene.terrainOptions.terrain}/full_${_}.drc`))),await Promise.all(e.map(_=>geometryLoader.batched(`planets/${this.scene.terrainOptions.terrain}/full-lod-1_${_}.drc`))),await Promise.all(e.map(_=>geometryLoader.batched(`planets/${this.scene.terrainOptions.terrain}/full-lod-2_${_}.drc`))),await Promise.all(e.map(_=>geometryLoader.batched(`planets/${this.scene.terrainOptions.terrain}/full-lod-3_${_}.drc`)))]),s=i[0].flat(),a=i[1].flat(),o=i[2].flat(),l=i[3].flat());const c=Math.max((s==null?void 0:s.length)||0,(a==null?void 0:a.length)||0,(o==null?void 0:o.length)||0,(l==null?void 0:l.length)||0);s&&s.length<c&&fillEmptyLODs(s,c),a&&a.length<c&&fillEmptyLODs(a,c),o&&o.length<c&&fillEmptyLODs(o,c),l&&l.length<c&&fillEmptyLODs(l,c);const h=s.length,d=s.reduce((_,x)=>_+x.attributes.position.count,0),p=s.reduce((_,x)=>_+x.index.count,0);this.mesh=new BatchedMesh(h,d,p,new baseMaterial({isTerrain:!0,...this.options.materialArgs})),this.mesh.name="planet-chunks-LOD-0",this.mesh.sortObjects=!1,this.mesh.receiveShadow=!0,this.mesh.castShadow=!0,this.mesh.frustumCulled=!1,this.mesh.perObjectFrustumCulled=!1,s.forEach((_,x)=>{this.mesh.addInstance(this.mesh.addGeometry(_))}),this.mesh.__onBeforeRender=this.mesh.onBeforeRender,this.mesh.onBeforeRender=()=>{},this.scene.add(this.mesh),this.mesh.onBeforeRender=this.update.bind(this);const f=[a,o];l&&f.push(l),f.forEach((_,x)=>{this.extraLODs++;const b=_.length,T=_.reduce((D,R)=>D+R.attributes.position.count,0),M=_.reduce((D,R)=>D+R.index.count,0);this[`mesh${x+1}`]=new BatchedMesh(b,T,M,new baseMaterial({isTerrain:!0,...this.options.materialArgs}));const w=this[`mesh${x+1}`];w.name=`planet-chunks-LOD-${x+1}`,w.sortObjects=!1,w.receiveShadow=!0,w.castShadow=!0,w.frustumCulled=!1,w.perObjectFrustumCulled=!1,_.forEach((D,R)=>{w.addInstance(w.addGeometry(D))}),w.__onBeforeRender=w.onBeforeRender,w.onBeforeRender=()=>{},this.scene.add(w)}),this.isReady()}update(e,i,s,a,o){var h;if(!((h=this.scene.characters)!=null&&h.mesh))return;_matrix.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse).multiply(this.mesh.matrixWorld),_frustum.setFromProjectionMatrix(_matrix,e.coordinateSystem);const l=this.scene.characters.mesh._localObject,c=l.position.length();for(let d=0;d<this.mesh._instanceInfo.length;d++){this.mesh._instanceInfo[d].visible=!1;for(let b=0;b<this.extraLODs;b++)this[`mesh${b+1}`]._instanceInfo[d].visible=!1;this.mesh.getBoundingSphereAt(d,_s$4),this.mesh._instanceInfo[d].__culled=!_frustum.intersectsSphere(_s$4),_v0$7.copy(l.position).sub(_s$4.center).normalize();const p=_s$4.center.distanceTo(l.position),f=Math.min(p,_s$4.radius);_v1$4.copy(_s$4.center).addScaledVector(_v0$7,f),this.mesh._instanceInfo[d].__distanceToCharacter=l.position.distanceTo(_v1$4);const _=Math.abs(_s$4.center.length()-c),x=Math.min(p,_s$4.radius+_);_v1$4.copy(_s$4.center).addScaledVector(_v0$7,x),_v0$7.copy(l.position).divideScalar(c||1),this.mesh._instanceInfo[d].__dotCharacter=_v0$7.dot(_v1$4.normalize())}for(let d=0;d<this.mesh._instanceInfo.length;d++)if(this.mesh._instanceInfo[d].__dotCharacter<this.DOT_THRESHOLD||this.mesh._instanceI
