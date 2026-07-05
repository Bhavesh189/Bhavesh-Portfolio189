import { Suspense, useEffect, useRef, useState } from 'react';

export default function LazySection({ id, children, minHeight = '70vh' }) {
  const ref = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shouldLoad) return undefined;

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -70% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const placeholder = (
    <section
      ref={ref}
      id={id}
      className="section lazy-section-placeholder"
      style={{ minHeight }}
      aria-hidden="true"
    />
  );

  if (!shouldLoad) return placeholder;

  return <Suspense fallback={placeholder}>{children}</Suspense>;
}
