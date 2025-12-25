import { useEffect, useRef } from 'react';

/**
 * useClickOutside Hook
 * 
 * Detect clicks outside a specific element
 * Perfect for closing dropdowns, modals, and menus
 * 
 * @param {Function} handler - Function to call when clicked outside
 * @returns {Object} ref - Ref to attach to the element
 * 
 * @example
 * // Close dropdown when clicking outside
 * const [isOpen, setIsOpen] = useState(false);
 * const dropdownRef = useClickOutside(() => setIsOpen(false));
 * 
 * return (
 *   <div ref={dropdownRef}>
 *     <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
 *     {isOpen && (
 *       <div className="dropdown">
 *         Dropdown content
 *       </div>
 *     )}
 *   </div>
 * );
 * 
 * @example
 * // Close modal when clicking backdrop
 * const modalRef = useClickOutside(() => setShowModal(false));
 * 
 * return (
 *   <div className="modal-backdrop">
 *     <div ref={modalRef} className="modal">
 *       Modal content
 *     </div>
 *   </div>
 * );
 */
const useClickOutside = (handler) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicked element is outside the ref element
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler]);

  return ref;
};

/**
 * useClickOutsideMultiple Hook
 * 
 * Detect clicks outside multiple elements
 * Useful when you have nested components that should stay open
 * 
 * @param {Function} handler - Function to call when clicked outside
 * @param {Array} refs - Array of refs to check
 * 
 * @example
 * const buttonRef = useRef(null);
 * const menuRef = useRef(null);
 * 
 * useClickOutsideMultiple(() => setIsOpen(false), [buttonRef, menuRef]);
 * 
 * return (
 *   <>
 *     <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
 *       Toggle
 *     </button>
 *     {isOpen && (
 *       <div ref={menuRef} className="menu">
 *         Menu content
 *       </div>
 *     )}
 *   </>
 * );
 */
export const useClickOutsideMultiple = (handler, refs = []) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside ALL refs
      const isOutside = refs.every(
        ref => ref.current && !ref.current.contains(event.target)
      );

      if (isOutside) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler, refs]);
};

/**
 * useEscapeKey Hook
 * 
 * Execute handler when Escape key is pressed
 * Often used together with useClickOutside
 * 
 * @param {Function} handler - Function to call when Escape is pressed
 * 
 * @example
 * // Close modal on Escape
 * useEscapeKey(() => setShowModal(false));
 */
export const useEscapeKey = (handler) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handler(event);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handler]);
};

/**
 * useLockBodyScroll Hook
 * 
 * Prevent body scroll when component is mounted
 * Useful for modals and overlays
 * 
 * @param {boolean} lock - Whether to lock scroll (default: true)
 * 
 * @example
 * // Lock scroll when modal is open
 * const Modal = ({ isOpen }) => {
 *   useLockBodyScroll(isOpen);
 *   
 *   if (!isOpen) return null;
 *   
 *   return <div className="modal">...</div>;
 * };
 */
export const useLockBodyScroll = (lock = true) => {
  useEffect(() => {
    if (!lock) return;

    // Save original body overflow
    const originalOverflow = document.body.style.overflow;

    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Restore on cleanup
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [lock]);
};

export default useClickOutside;