// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/malig/Desktop/Yeni%20klas%C3%B6r/sanat-galerisi/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/malig/Desktop/Yeni%20klas%C3%B6r/sanat-galerisi/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\malig\\Desktop\\Yeni klas\xF6r\\sanat-galerisi";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      },
      dedupe: ["react", "react-dom"]
    },
    server: {
      port: 3001,
      strictPort: true,
      host: true,
      open: true
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "EVAL" || warning.code === "SOURCEMAP_ERROR" || warning.code === "THIS_IS_UNDEFINED" || warning.code === "MISSING_EXPORT" || warning.code === "PURE_COMMENT_HAS_INVALID_POSITION") return;
          warn(warning);
        },
        input: {
          main: path.resolve(__vite_injected_original_dirname, "index.html")
        },
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "ui-vendor": ["@radix-ui/react-icons", "@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"]
          },
          format: "es",
          generatedCode: {
            arrowFunctions: true,
            constBindings: true,
            objectShorthand: true
          }
        },
        external: [],
        preserveEntrySignatures: "strict",
        treeshake: {
          moduleSideEffects: true,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false
        }
      },
      commonjsOptions: {
        include: [/node_modules/],
        extensions: [".js", ".cjs", ".jsx", ".tsx", ".ts"],
        strictRequires: true,
        transformMixedEsModules: true,
        sourceMap: true
      },
      target: "es2015",
      minify: "terser",
      terserOptions: {
        compress: {
          arrows: true,
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ["console.log"],
          passes: 2
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false,
          preserve_annotations: true
        }
      }
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@radix-ui/react-icons",
        "@radix-ui/react-slot",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "framer-motion",
        "lucide-react"
      ],
      exclude: [],
      esbuildOptions: {
        target: "es2020",
        format: "esm",
        treeShaking: true,
        minify: true,
        keepNames: true
      }
    },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(env.VITE_SUPABASE_ANON_KEY)
    },
    envDir: "."
    // .env dosyalarının okunacağı dizin
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtYWxpZ1xcXFxEZXNrdG9wXFxcXFllbmkga2xhc1x1MDBGNnJcXFxcc2FuYXQtZ2FsZXJpc2lcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG1hbGlnXFxcXERlc2t0b3BcXFxcWWVuaSBrbGFzXHUwMEY2clxcXFxzYW5hdC1nYWxlcmlzaVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbWFsaWcvRGVza3RvcC9ZZW5pJTIwa2xhcyVDMyVCNnIvc2FuYXQtZ2FsZXJpc2kvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICAvLyBPcnRhbSBkZVx1MDExRmlcdTAxNUZrZW5sZXJpbmkgeVx1MDBGQ2tsZVxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpO1xuXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICB9LFxuICAgICAgZGVkdXBlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IDMwMDEsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgaG9zdDogdHJ1ZSxcbiAgICAgIG9wZW46IHRydWVcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBvdXREaXI6ICdkaXN0JyxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb253YXJuKHdhcm5pbmcsIHdhcm4pIHtcbiAgICAgICAgICBpZiAod2FybmluZy5jb2RlID09PSAnRVZBTCcgfHwgXG4gICAgICAgICAgICAgIHdhcm5pbmcuY29kZSA9PT0gJ1NPVVJDRU1BUF9FUlJPUicgfHwgXG4gICAgICAgICAgICAgIHdhcm5pbmcuY29kZSA9PT0gJ1RISVNfSVNfVU5ERUZJTkVEJyB8fFxuICAgICAgICAgICAgICB3YXJuaW5nLmNvZGUgPT09ICdNSVNTSU5HX0VYUE9SVCcgfHxcbiAgICAgICAgICAgICAgd2FybmluZy5jb2RlID09PSAnUFVSRV9DT01NRU5UX0hBU19JTlZBTElEX1BPU0lUSU9OJykgcmV0dXJuO1xuICAgICAgICAgIHdhcm4od2FybmluZyk7XG4gICAgICAgIH0sXG4gICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgbWFpbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKVxuICAgICAgICB9LFxuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgICAgJ3VpLXZlbmRvcic6IFsnQHJhZGl4LXVpL3JlYWN0LWljb25zJywgJ0ByYWRpeC11aS9yZWFjdC1zbG90JywgJ2NsYXNzLXZhcmlhbmNlLWF1dGhvcml0eScsICdjbHN4JywgJ3RhaWx3aW5kLW1lcmdlJ11cbiAgICAgICAgICB9LFxuICAgICAgICAgIGZvcm1hdDogJ2VzJyxcbiAgICAgICAgICBnZW5lcmF0ZWRDb2RlOiB7XG4gICAgICAgICAgICBhcnJvd0Z1bmN0aW9uczogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnN0QmluZGluZ3M6IHRydWUsXG4gICAgICAgICAgICBvYmplY3RTaG9ydGhhbmQ6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGV4dGVybmFsOiBbXSxcbiAgICAgICAgcHJlc2VydmVFbnRyeVNpZ25hdHVyZXM6ICdzdHJpY3QnLFxuICAgICAgICB0cmVlc2hha2U6IHtcbiAgICAgICAgICBtb2R1bGVTaWRlRWZmZWN0czogdHJ1ZSxcbiAgICAgICAgICBwcm9wZXJ0eVJlYWRTaWRlRWZmZWN0czogZmFsc2UsXG4gICAgICAgICAgdHJ5Q2F0Y2hEZW9wdGltaXphdGlvbjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgICBpbmNsdWRlOiBbL25vZGVfbW9kdWxlcy9dLFxuICAgICAgICBleHRlbnNpb25zOiBbJy5qcycsICcuY2pzJywgJy5qc3gnLCAnLnRzeCcsICcudHMnXSxcbiAgICAgICAgc3RyaWN0UmVxdWlyZXM6IHRydWUsXG4gICAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgICAgICBzb3VyY2VNYXA6IHRydWVcbiAgICAgIH0sXG4gICAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBhcnJvd3M6IHRydWUsXG4gICAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgICAgcHVyZV9mdW5jczogWydjb25zb2xlLmxvZyddLFxuICAgICAgICAgIHBhc3NlczogMlxuICAgICAgICB9LFxuICAgICAgICBtYW5nbGU6IHtcbiAgICAgICAgICBzYWZhcmkxMDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICBjb21tZW50czogZmFsc2UsXG4gICAgICAgICAgcHJlc2VydmVfYW5ub3RhdGlvbnM6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgICdyZWFjdCcsIFxuICAgICAgICAncmVhY3QtZG9tJywgXG4gICAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1pY29ucycsXG4gICAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc2xvdCcsXG4gICAgICAgICdjbGFzcy12YXJpYW5jZS1hdXRob3JpdHknLFxuICAgICAgICAnY2xzeCcsXG4gICAgICAgICd0YWlsd2luZC1tZXJnZScsXG4gICAgICAgICdmcmFtZXItbW90aW9uJyxcbiAgICAgICAgJ2x1Y2lkZS1yZWFjdCdcbiAgICAgIF0sXG4gICAgICBleGNsdWRlOiBbXSxcbiAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgICAgIGZvcm1hdDogJ2VzbScsXG4gICAgICAgIHRyZWVTaGFraW5nOiB0cnVlLFxuICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICAgIGtlZXBOYW1lczogdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfU1VQQUJBU0VfVVJMJzogSlNPTi5zdHJpbmdpZnkoZW52LlZJVEVfU1VQQUJBU0VfVVJMKSxcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9TVVBBQkFTRV9BTk9OX0tFWSc6IEpTT04uc3RyaW5naWZ5KGVudi5WSVRFX1NVUEFCQVNFX0FOT05fS0VZKSxcbiAgICB9LFxuICAgIGVudkRpcjogJy4nLCAvLyAuZW52IGRvc3lhbGFyXHUwMTMxblx1MDEzMW4gb2t1bmFjYVx1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
