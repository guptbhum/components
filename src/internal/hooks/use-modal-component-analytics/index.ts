// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';

import { ModalContextProps, useModalContext } from '../../context/modal-context';
import { useEffectOnUpdate } from '../use-effect-on-update';

export const usePrimaryButtonModalComponentAnalytics = (
  isPrimaryButton: boolean,
  elementRef: React.RefObject<HTMLElement>,
  dependencies: React.DependencyList
) => {
  const modalContext = useModalContext();
  useEffect(() => {
    if (!isPrimaryButton || !elementRef.current || !modalContext.isInModal) {
      return;
    }
    modalContext.componentLoadingCount.current++;
    if (!isElementVisible(elementRef.current)) {
      return;
    }
    modalContext.componentLoadingCount.current--;
    setModalLoadCompleteTime(modalContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffectOnUpdate(() => {
    if (!isPrimaryButton || !elementRef.current || !modalContext.isInModal) {
      return;
    }
    if (!isElementVisible(elementRef.current)) {
      return;
    }

    modalContext.componentLoadingCount.current--;
    setModalLoadCompleteTime(modalContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

const isElementVisible = (htmlElement: HTMLElement) => {
  if (!htmlElement) {
    return true;
  }
  return (
    htmlElement.offsetWidth > 0 && htmlElement.offsetHeight > 0 && getComputedStyle(htmlElement).visibility !== 'hidden'
  );
};

export const useModalContextLoadingComponent = () => {
  const modalContext = useModalContext();
  useEffect(() => {
    if (!modalContext.isInModal) {
      return;
    }
    modalContext.componentLoadingCount.current++;
    return () => {
      modalContext.componentLoadingCount.current--;
      setModalLoadCompleteTime(modalContext);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const setModalLoadCompleteTime = (modalContext: ModalContextProps) => {
  const { componentLoadingCount, loadCompleteTime } = modalContext;
  if (componentLoadingCount.current === 0 && loadCompleteTime.current === 0) {
    loadCompleteTime.current = performance.now();
  }
};
