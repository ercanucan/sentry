import React from 'react';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import xor from 'lodash/xor';

import BulkNotice from './bulkNotice';

type RenderProps = {
  /**
   * Are all rows on current page selected?
   */
  isPageSelected: boolean;
  /**
   * Callback for toggling single row
   */
  onRowToggle: (id: string) => void;
  /**
   * Callback for toggling all rows across all pages
   */
  onAllRowsToggle: (select: boolean) => void;
  /**
   * Callback for toggling all rows on current page
   */
  onPageRowsToggle: (select: boolean) => void;
  /**
   * Ready to be rendered summary component showing how many items are selected,
   * with buttons to select everything, cancel everything, etc...
   */
  renderBulkNotice: () => React.ReactNode;
} & Pick<State, 'selectedIds' | 'isAllSelected'>;

type State = {
  /**
   * Selected ids on the current page
   */
  selectedIds: string[];
  /**
   * Are all rows across all pages selected?
   */
  isAllSelected: boolean;
};

type Props = {
  /**
   * Array of ids on current page
   */
  pageIds: string[];
  /**
   * Number of all rows across all pages
   */
  allRowsCount: number;
  /**
   * Number of grid columns to stretch the selection summary (used in BulkNotice)
   */
  columnsCount: number;
  /**
   * Children with render props
   */
  children: (props: RenderProps) => React.ReactNode;
  /**
   * BulkController State
   */
  onChange?: (props: State) => void;
  /**
   * Maximum number of rows that can be bulk manipulated at once (used in BulkNotice)
   */
  bulkLimit?: number;
  /**
   * Array of default selected ids
   */
  defaultSelectedIds?: string[];
};

class BulkController extends React.Component<Props, State> {
  state: State = this.getInitialState();

  getInitialState() {
    const {defaultSelectedIds, pageIds} = this.props;
    return {
      selectedIds: intersection(defaultSelectedIds ?? [], pageIds),
      isAllSelected: false,
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      ...state,
      selectedIds: intersection(state.selectedIds, props.pageIds),
    };
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (!isEqual(prevState, this.state)) {
      this.props.onChange?.(this.state);
    }
  }

  handleRowToggle = (id: string) => {
    const {pageIds} = this.props;
    this.setState(state => {
      const selectedIds = xor(state.selectedIds, [id]);
      return {
        selectedIds,
        isAllSelected: selectedIds.length === pageIds.length,
      };
    });
  };

  handleAllRowsToggle = (select: boolean) => {
    const {pageIds} = this.props;
    this.setState({
      selectedIds: select ? [...pageIds] : [],
      isAllSelected: select,
    });
  };

  handlePageRowsToggle = (select: boolean) => {
    const {pageIds} = this.props;
    this.setState(state => ({
      selectedIds: select
        ? uniq([...state.selectedIds, ...pageIds])
        : state.selectedIds.filter(id => !pageIds.includes(id)),
      isAllSelected: false,
    }));
  };

  render() {
    const {pageIds, children, columnsCount, allRowsCount, bulkLimit} = this.props;
    const {selectedIds, isAllSelected} = this.state;

    const isPageSelected =
      pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id));

    const renderProps: RenderProps = {
      selectedIds,
      isAllSelected,
      isPageSelected,
      onRowToggle: this.handleRowToggle,
      onAllRowsToggle: this.handleAllRowsToggle,
      onPageRowsToggle: this.handlePageRowsToggle,
      renderBulkNotice: () => (
        <BulkNotice
          allRowsCount={allRowsCount}
          selectedRowsCount={selectedIds.length}
          onUnselectAllRows={() => this.handleAllRowsToggle(false)}
          onSelectAllRows={() => this.handleAllRowsToggle(true)}
          columnsCount={columnsCount}
          isPageSelected={isPageSelected}
          isAllSelected={isAllSelected}
          bulkLimit={bulkLimit}
        />
      ),
    };

    return children(renderProps);
  }
}

export default BulkController;
