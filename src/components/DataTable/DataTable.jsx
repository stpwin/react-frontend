import React, { Component, Fragment } from "react";

import {
  Table,
  InputGroup,
  FormControl,
  Row,
  Col,
  Form,
  Button,
  Dropdown,
  ButtonToolbar,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";

import "./table.css";

import { FaSearch, FaTimes, FaSlidersH } from "react-icons/fa";

import Highlight from "react-highlighter";

import Paginator from "./Paginator";

export class DataTable extends Component {
  state = {
    filterText: ""
  };

  handleFilterTextChange = event => {
    this.setState({
      filterText: event.target.value
    });
    const { filterTextChange } = this.props;
    if (filterTextChange) filterTextChange(event.target.value);
  };

  clearFilterText = () => {
    this.setState({
      filterText: ""
    });
    const { filterTextChange } = this.props;
    if (filterTextChange) filterTextChange("");
  };

  render() {
    // console.log(this.props);
    const { filterText } = this.state;
    const {
      filterPlaceholder,
      columns,
      data,
      pageNo,
      maxPage,
      onNextPage,
      onPrevPage,
      onPageChange,
      onPerPageChange,
      perPage,
      perPages,
      filters,
      filterChecked,
      onFilterCheckedChange,
      tools,
      idKey,
      customValueKey,
      topButtons
      // searchText
    } = this.props;
    return (
      <div className="data-table">
        <Row>
          <Col>
            {topButtons && topButtons.length > 0
              ? topButtons.map((item, index) => {
                  return (
                    <Button
                      key={`button-${item.key}`}
                      variant="outline"
                      className="pea-color"
                      onClick={() => item.onClick()}
                    >
                      {item.text}
                    </Button>
                  );
                })
              : null}
          </Col>
          <Col />
          <Col className="text-right align-self-center">
            {perPage ? (
              <Fragment>
                <div className="perPageDropdown">
                  <span>แสดง</span>
                  <Dropdown
                    id="dropdown-item-button"
                    onSelect={onPerPageChange}
                  >
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="dropdown-basic"
                    >
                      {perPage}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {perPages &&
                        perPages.map((key, index) => {
                          return (
                            <Dropdown.Item
                              key={`perPage-${index}`}
                              eventKey={key}
                            >
                              {key}
                            </Dropdown.Item>
                          );
                        })}
                    </Dropdown.Menu>
                  </Dropdown>
                  <span>รายการ</span>
                </div>
              </Fragment>
            ) : null}
          </Col>
        </Row>

        <Row className="filterRow">
          <Col className="align-self-center">
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                placeholder={filterPlaceholder}
                onChange={this.handleFilterTextChange}
                value={filterText}
              />
              {filterText.length > 0 ? (
                <InputGroup.Append>
                  <Button
                    variant="outline-secondary"
                    onClick={this.clearFilterText}
                  >
                    <FaTimes />
                  </Button>
                </InputGroup.Append>
              ) : null}
            </InputGroup>
          </Col>
          <Col className="align-self-center">
            {filters &&
              filters.map((filter, index) => {
                return (
                  <Form.Check
                    custom
                    inline
                    key={`filter-${index}`}
                    name={`filter-${index}`}
                    label={filter.text}
                    checked={filterChecked[index]}
                    onChange={onFilterCheckedChange}
                    id={`filter-${index}`}
                  />
                );
              })}
            {/* <Form.Check custom inline label='G1' id='inline-1' />
            <Form.Check custom inline label='G2' id='inline-2' /> */}
          </Col>
          <Col className="text-right align-self-center">
            <Paginator
              curPage={pageNo}
              maxPage={maxPage}
              pageChange={onPageChange}
              pageChangePrev={onPrevPage}
              pageChangeNext={onNextPage}
            />
          </Col>
        </Row>

        <Table responsive bordered hover size="sm">
          <thead className="text-center thread-pea">
            <tr>
              {columns &&
                columns.map((col, index) => {
                  return (
                    <th key={`th-${index}`} className="align-middle">
                      {col.text}
                    </th>
                  );
                })}
              <th key={`th-toolsbar`} className="align-middle">
                <FaSlidersH />
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, dataIndex) => {
                // console.log("peaId", item.peaId);
                return (
                  <tr key={`tr-${dataIndex}`}>
                    {columns && //////////////List Data
                      columns.map((col, colIndex) => {
                        return (
                          <td
                            key={`td-${colIndex}${dataIndex}`}
                            className={`align-middle ${
                              col.valign === "true" ? "text-center" : null
                            }`}
                          >
                            {col.canSearch ? (
                              <Highlight
                                matchStyle={{
                                  color: "white",
                                  backgroundColor: "#563d7c"
                                }}
                                search={filterText}
                              >
                                {item[col.dataField]}
                              </Highlight>
                            ) : (
                              item[col.dataField]
                            )}
                          </td>
                        ); //////////////////List data
                      })}
                    {tools && tools.length > 0 ? (
                      <td
                        key={`td-toolsbar`}
                        className="align-middle text-center td-tools-button"
                      >
                        <ButtonToolbar aria-label="Toolbar with button groups">
                          {tools.map((data, index) => {
                            // console.log(data);
                            return (
                              <OverlayTrigger
                                key={`overlay-${data.key}`}
                                placement={"top"}
                                overlay={
                                  <Tooltip id={`tooltip-${data.key}`}>
                                    {data.overlaytext}
                                  </Tooltip>
                                }
                              >
                                <Button
                                  key={`button-${data.key}`}
                                  variant={"outline"}
                                  size={"sm"}
                                  className={"pea-color"}
                                  onClick={() =>
                                    data.customValue
                                      ? data.onclick(
                                          item[idKey],
                                          item[customValueKey]
                                        )
                                      : data.onclick(item[idKey])
                                  }
                                >
                                  {data.icon}
                                </Button>
                              </OverlayTrigger>
                            );
                          })}
                        </ButtonToolbar>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  className="text-center align-middle"
                  colSpan={columns && columns.length + (tools ? 1 : 0)}
                >
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Row>
          <Col />
          <Col />
          <Col>
            <Paginator
              curPage={pageNo}
              maxPage={maxPage}
              pageChange={onPageChange}
              pageChangePrev={onPrevPage}
              pageChangeNext={onNextPage}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default DataTable;
