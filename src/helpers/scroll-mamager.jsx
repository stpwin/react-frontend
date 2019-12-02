import React from "react";
import requestAnimationFrame from "raf";

export const memoryStore = {
  data: new Map(),
  get(key) {
    if (!key) {
      return null;
    }

    return this.data.get(key) || null;
  },
  set(key, data) {
    if (!key) {
      return;
    }
    return this.data.set(key, data);
  }
};

/**
 * Component that will save and restore Window scroll position.
 */

export default class ScrollPositionManager extends React.Component {
  constructor(props) {
    super(...arguments);
    this.connectScrollTarget = this.connectScrollTarget.bind(this);
    this._target = window;
  }

  connectScrollTarget(node) {
    this._target = node;
  }

  restoreScrollPosition(pos) {
    pos = pos || this.props.scrollStore.get(this.props.scrollKey);
    if (this._target && pos) {
      requestAnimationFrame(() => {
        scroll(this._target, pos.x, pos.y);
      });
    }
  }

  saveScrollPosition(key) {
    if (this._target) {
      const pos = getScrollPosition(this._target);
      key = key || this.props.scrollKey;
      this.props.scrollStore.set(key, pos);
    }
  }

  componentDidMount() {
    this.restoreScrollPosition();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.scrollKey !== nextProps.scrollKey) {
      this.saveScrollPosition();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.scrollKey !== prevProps.scrollKey) {
      this.restoreScrollPosition();
    }
  }

  componentWillUnmount() {
    this.saveScrollPosition();
  }

  render() {
    const { children = null, ...props } = this.props;
    return (
      children &&
      children({ ...props, connectScrollTarget: this.connectScrollTarget })
    );
  }
}

ScrollPositionManager.defaultProps = {
  scrollStore: memoryStore
};

function scroll(target, x, y) {
  if (target instanceof window.Window) {
    target.scrollTo(x, y);
  } else {
    target.scrollLeft = x;
    target.scrollTop = y;
  }
}

function getScrollPosition(target) {
  if (target instanceof window.Window) {
    return { x: target.scrollX, y: target.scrollY };
  }

  return { x: target.scrollLeft, y: target.scrollTop };
}
