/**
 * React 19 Compatibility Wrapper
 * 
 * This component provides compatibility fixes for third-party libraries
 * that haven't been updated for React 19 yet, specifically @suiet/wallet-kit
 */

import React, { useEffect, ComponentType, ReactNode } from 'react';

interface CompatWrapperProps {
  children: ReactNode;
}

/**
 * Suppress React 19 deprecation warnings from third-party libraries
 */
const suppressReact19Warnings = () => {
  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;

  // Filter React 19 compatibility warnings from @suiet/wallet-kit
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    // Suppress known React 19 warnings from Suiet Wallet Kit
    if (
      message.includes('Accessing element.ref was removed in React 19') ||
      message.includes('empty string ("") was passed to the src attribute') ||
      message.includes('ref is now a regular prop')
    ) {
      return;
    }
    
    originalWarn.apply(console, args);
  };

  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    // Suppress aria-hidden focus warnings from modal overlays
    if (
      message.includes('aria-hidden on an element because its descendant retained focus') ||
      message.includes('Blocked aria-hidden')
    ) {
      return;
    }
    
    originalError.apply(console, args);
  };

  // Return cleanup function
  return () => {
    console.warn = originalWarn;
    console.error = originalError;
  };
};

/**
 * Fix aria-hidden accessibility issues in modal overlays
 */
const fixAriaHiddenIssues = () => {
  // Monitor for aria-hidden elements that contain focused elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
        const element = mutation.target as HTMLElement;
        
        // If element is aria-hidden but contains a focused element, remove aria-hidden
        if (element.getAttribute('aria-hidden') === 'true') {
          const focusedElement = element.querySelector(':focus');
          if (focusedElement) {
            element.removeAttribute('aria-hidden');
            console.debug('[React19Compat] Removed aria-hidden from element with focused child');
          }
        }
      }
    });
  });

  // Observe the entire document for aria-hidden changes
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['aria-hidden'],
    subtree: true,
  });

  return () => observer.disconnect();
};

/**
 * Fix empty src attributes in images from wallet kit
 */
const fixEmptyImageSrc = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          
          // Fix empty src in img tags
          const images = element.querySelectorAll('img[src=""]');
          images.forEach((img) => {
            img.setAttribute('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E');
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
};

/**
 * React 19 Compatibility Wrapper Component
 */
export const React19CompatWrapper: React.FC<CompatWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Apply compatibility fixes
    const cleanupWarnings = suppressReact19Warnings();
    const cleanupAria = fixAriaHiddenIssues();
    const cleanupImages = fixEmptyImageSrc();

    // Cleanup on unmount
    return () => {
      cleanupWarnings();
      cleanupAria();
      cleanupImages();
    };
  }, []);

  return <>{children}</>;
};

/**
 * HOC to wrap any component with React 19 compatibility fixes
 */
export function withReact19Compat<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return function CompatComponent(props: P) {
    return (
      <React19CompatWrapper>
        <Component {...props} />
      </React19CompatWrapper>
    );
  };
}
