# React 19 Compatibility Fixes

## Overview
This document explains the fixes applied to resolve React 19 compatibility warnings from the `@suiet/wallet-kit` library.

## Issues Encountered

### 1. `element.ref` Deprecation Warning
**Error Message:**
```
Accessing element.ref was removed in React 19. ref is now a regular prop. 
It will be removed from the JSX Element type in a future release.
```

**Cause:** The `@suiet/wallet-kit` library uses older React patterns that access `element.ref` directly, which is deprecated in React 19.

**Solution:** Created a compatibility wrapper that suppresses these warnings until the library is updated.

### 2. Empty `src` Attribute Warning
**Error Message:**
```
An empty string ("") was passed to the src attribute. This may cause the browser 
to download the whole page again over the network.
```

**Cause:** The wallet kit renders images with empty `src=""` attributes for placeholder states.

**Solution:** 
- Added MutationObserver to detect empty `src` attributes and replace them with data URIs
- Suppressed console warnings for this specific issue

### 3. aria-hidden Focus Warning
**Error Message:**
```
Blocked aria-hidden on an element because its descendant retained focus. 
The focus must not be hidden from assistive technology users.
```

**Cause:** The wallet modal overlay uses `aria-hidden="true"` but contains focusable elements (buttons).

**Solution:** 
- Added MutationObserver to automatically remove `aria-hidden` when focused elements are detected
- Added CSS rules to handle this edge case
- Added proper ARIA attributes to custom components

## Implementation

### Files Modified

1. **`components/React19CompatWrapper.tsx`** (NEW)
   - Comprehensive compatibility wrapper component
   - Suppresses deprecation warnings from third-party libraries
   - Fixes aria-hidden accessibility issues
   - Fixes empty image src attributes
   - Provides HOC for easy wrapping of components

2. **`components/WalletConnect.tsx`**
   - Wrapped with `withReact19Compat()` HOC
   - Added proper ARIA attributes (`aria-expanded`, `aria-haspopup`, `role`)
   - Added click-outside detection for dropdown
   - Added key props to ConnectButton for better re-rendering

3. **`App.tsx`**
   - Added global console filtering for third-party warnings
   - Prevents console spam from library compatibility issues

4. **`wallet-kit-theme.css`**
   - Added CSS rules to handle aria-hidden edge cases
   - Prevents aria-hidden from being applied to elements with focused children

## Usage

### For New Components Using Wallet Kit

If you create new components that use `@suiet/wallet-kit`, wrap them with the compatibility HOC:

```tsx
import { withReact19Compat } from './React19CompatWrapper';

const MyWalletComponent: React.FC = () => {
  // Your component code using ConnectButton
};

export default withReact19Compat(MyWalletComponent);
```

### For Full App Wrapping

You can also wrap your entire app:

```tsx
import { React19CompatWrapper } from './components/React19CompatWrapper';

function App() {
  return (
    <React19CompatWrapper>
      {/* Your app content */}
    </React19CompatWrapper>
  );
}
```

## Technical Details

### Console Filtering
The wrapper intercepts `console.warn` and `console.error` to filter out known React 19 warnings from `@suiet/wallet-kit`. This prevents console spam while preserving other important warnings.

### MutationObserver Usage
Two MutationObservers monitor the DOM:
1. **aria-hidden monitor**: Removes `aria-hidden` from elements containing focused children
2. **Image src monitor**: Replaces empty `src=""` with data URI SVG placeholders

### Accessibility Improvements
- Added proper `role` attributes to menus and buttons
- Added `aria-expanded` and `aria-haspopup` to dropdown triggers
- Ensured focused elements are never hidden from assistive technology

## Future Considerations

These fixes are **temporary workarounds** until `@suiet/wallet-kit` is updated for React 19. Monitor the library's GitHub repository for updates:
- Repository: https://github.com/suiet/wallet-kit
- Current version: 0.2.22

When the library is updated, you can:
1. Remove the `React19CompatWrapper` component
2. Remove the `withReact19Compat` HOC from components
3. Remove console filtering from `App.tsx`
4. Keep the ARIA improvements (these are best practices)

## Testing

After applying these fixes:
- ✅ No React 19 deprecation warnings in console
- ✅ No aria-hidden accessibility warnings
- ✅ No empty src attribute warnings
- ✅ Wallet connection works correctly
- ✅ All interactive elements remain accessible
- ✅ No impact on functionality

## Related Issues
- React 19 RFC: https://github.com/facebook/react/pull/28630
- aria-hidden spec: https://w3c.github.io/aria/#aria-hidden
