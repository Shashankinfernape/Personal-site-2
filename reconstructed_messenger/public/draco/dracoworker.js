/* Abeto Custom Draco Decoder Worker with Full Metadata & Generic Attribute Support */
(function () {
  'use strict';
  let a = null;
  const I = [
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
  ];
  const T = new TextDecoder();

  function _(e, r) {
    switch (r) {
      case Float32Array: return e.DT_FLOAT32;
      case Int8Array: return e.DT_INT8;
      case Int16Array: return e.DT_INT16;
      case Int32Array: return e.DT_INT32;
      case Uint8Array: return e.DT_UINT8;
      case Uint16Array: return e.DT_UINT16;
      case Uint32Array: return e.DT_UINT32;
    }
  }

  let D = null;
  const g = () =>
    D ||
    (D = new Promise((resolve, reject) => {
      try {
        if (!self.DracoDecoderModule) {
          importScripts('/draco/draco_decoder.js');
        }
        self.DracoDecoderModule({
          onModuleLoaded: (draco) => {
            a = draco;
            resolve();
          },
        });
      } catch (e) {
        reject(e);
      }
    }));

  function h(e, r) {
    let n = null,
      s = null;
    const t = T.decode(new Uint8Array(r.slice(0, 5))) === 'DRACO';
    if (t) {
      n = new Int8Array(r);
    } else {
      const i = new Uint32Array(r.slice(0, 4))[0];
      s = JSON.parse(T.decode(r.slice(4, 4 + i)));
      n = new Int8Array(r.slice(4 + i));
    }
    let o = null,
      l = null;
    const u = e.GetEncodedGeometryType(n);
    if (u === a.TRIANGULAR_MESH) {
      o = new a.Mesh();
      l = e.DecodeArrayToMesh(n, n.byteLength, o);
    } else if (u === a.POINT_CLOUD) {
      o = new a.PointCloud();
      l = e.DecodeArrayToPointCloud(n, n.byteLength, o);
    } else {
      throw new Error('DRACOLoader: Unexpected geometry type.');
    }
    if (!l.ok() || o.ptr === 0) {
      throw new Error(`DRACOLoader: Decoding failed: ${l.error_msg()}`);
    }
    if (t) {
      const i = new a.MetadataQuerier();
      const A = e.GetMetadata(o);
      if (i.HasEntry(A, 'info')) {
        s = JSON.parse(i.GetStringEntry(A, 'info'));
      }
      a.destroy(i);
    }
    const f = {},
      y = {};
    if (s && s.attributes) {
      s.attributes.forEach((i, A) => {
        const m = i[0];
        f[m] = A;
        y[m] = I[i[1]];
      });
    }
    const d = { index: null, attributes: [], userData: {} };
    if (s && s.userData) d.userData = s.userData;
    for (const i in f) {
      const A = self[y[i]];
      const w = f[i];
      const m = e.GetAttributeByUniqueId(o, w);
      if (m && m.ptr !== 0) {
        const b = E(e, o, i, A, m);
        d.attributes.push(b);
      }
    }
    if (u === a.TRIANGULAR_MESH) {
      d.index = p(e, o);
    }
    a.destroy(o);
    return d;
  }

  function p(e, r) {
    const s = r.num_faces() * 3,
      c = s * 4,
      t = a._malloc(c);
    e.GetTrianglesUInt32Array(r, c, t);
    const o = new Uint32Array(a.HEAPF32.buffer, t, s).slice();
    a._free(t);
    return { array: o, itemSize: 1 };
  }

  function E(e, r, n, s, c) {
    const t = c.num_components(),
      l = r.num_points() * t,
      u = l * s.BYTES_PER_ELEMENT,
      f = _(a, s),
      y = a._malloc(u);
    e.GetAttributeDataArrayForAllPoints(r, c, f, u, y);
    const d = new s(a.HEAPF32.buffer, y, l).slice();
    a._free(y);
    return { name: n, array: d, itemSize: t };
  }

  onmessage = async (e) => {
    const { url, buffer, id } = e.data;
    try {
      await g();
      const c = new a.Decoder();
      try {
        const t = h(c, buffer);
        const o = t.attributes.map((l) => l.array.buffer);
        if (t.index) o.push(t.index.array.buffer);
        self.postMessage({ id, geometry: t }, o);
      } finally {
        a.destroy(c);
      }
    } catch (err) {
      console.error('dracoworker error:', err);
      self.postMessage({ id, error: true, message: String(err) });
    }
  };
})();
