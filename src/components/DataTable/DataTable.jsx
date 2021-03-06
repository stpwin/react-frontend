import React from "react";

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
  Tooltip,
  DropdownButton,
  Spinner,
  Badge
} from "react-bootstrap";

import "./table.css";

import {
  FaSearch,
  FaTimes,
  FaSlidersH,
  FaListUl,
  FaInfo
} from "react-icons/fa";
import Highlight from "react-highlighter";
import Paginator from "./Paginator";

export const DataTable = ({
  columns,
  data,
  page,
  pages,
  filterText,
  filterPlaceholder,
  limit,
  perPages,
  filters,
  filterChecked,
  tools,
  idKey,
  topButtons,
  filterLoading,
  onFilterTextChange,
  onClearFilterText,
  onFilterCheckedChange,
  onNextPage,
  onPrevPage,
  onPageChange,
  onPerPageChange
}) => {
  return (
    <div className="data-table">
      <Row>
        <Col>
          <div className="top-button">
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
          </div>
        </Col>

        <Col className="text-right align-self-center">
          {limit ? (
            <div className="perPageDropdown">
              <span>แสดง</span>
              <Dropdown id="dropdown-item-button" onSelect={onPerPageChange}>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-basic"
                >
                  {limit}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {perPages &&
                    perPages.map((key, index) => {
                      return (
                        <Dropdown.Item key={`perPage-${index}`} eventKey={key}>
                          {key}
                        </Dropdown.Item>
                      );
                    })}
                </Dropdown.Menu>
              </Dropdown>
              <span>รายการ</span>
            </div>
          ) : null}
        </Col>
      </Row>

      <Row>
        <Col className="align-self-center" xs lg="5">
          <div className="top-button">
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
                onChange={onFilterTextChange}
                value={filterText || ""}
              />
              {filterText && filterText.length > 0 ? (
                <InputGroup.Append>
                  {filterLoading ? (
                    <Button variant="outline-secondary" disabled>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        variant="dark"
                      />
                      {/* <span className="sr-only">Loading...</span> */}
                    </Button>
                  ) : (
                    <Button
                      variant="outline-secondary"
                      onClick={onClearFilterText}
                    >
                      <FaTimes />
                    </Button>
                  )}
                </InputGroup.Append>
              ) : null}
            </InputGroup>
          </div>
        </Col>

        {filters ? (
          <Col className="align-self-center" md="auto">
            <div className="top-button">
              {filters.map((filter, index) => {
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
            </div>
          </Col>
        ) : null}
        <Col
          className="align-self-center "
          sm
          md="auto"
          lg="5"
          style={{ marginInlineStart: "auto" }}
        >
          <Form.Group>
            <Paginator
              page={page}
              pages={pages}
              pageChange={onPageChange}
              pageChangePrev={onPrevPage}
              pageChangeNext={onNextPage}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <div style={{ overflow: "auto" }}>
            <Table
              responsive
              bordered
              hover
              size="sm"
              // style={{ width: "1078px" }}
            >
              <thead className="text-center thread-pea">
                {/* <tr>&nbsp;</tr> */}
                <tr>
                  {columns &&
                    columns.map((col, index) => {
                      return (
                        <th
                          key={`th-${index}`}
                          className="align-middle"
                          style={col.style}
                        >
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
                    return (
                      <tr key={`tr-${dataIndex}`}>
                        {columns &&
                          columns.map((col, colIndex) => {
                            return (
                              <td
                                key={`td-${colIndex}${dataIndex}`}
                                style={col.tdStyle}
                                className={`align-middle ${
                                  col.valign === "true" ? "text-center" : ""
                                } ${
                                  col.variable
                                    ? item[col.variable]
                                      ? "approved"
                                      : ""
                                    : ""
                                }`}
                              >
                                {col.canSearch ? (
                                  <Highlight
                                    matchStyle={{
                                      color: "white",
                                      backgroundColor: "#563d7c"
                                    }}
                                    search={filterText || ""}
                                  >
                                    {col.badge ? (
                                      <Badge variant={col.badge.variant}>
                                        {item[col.dataField] || ""}
                                      </Badge>
                                    ) : (
                                      item[col.dataField] || ""
                                    )}
                                  </Highlight>
                                ) : col.badge ? (
                                  <Badge
                                    style={{ fontWeight: "100" }}
                                    variant={
                                      col.badge.variable &&
                                      item[col.badge.variable]
                                        ? col.badge.variantVariable
                                        : col.badge.variant
                                    }
                                  >
                                    {item[col.dataField] || ""}
                                  </Badge>
                                ) : (
                                  <span style={{ whiteSpace: "pre-wrap" }}>
                                    {item[col.dataField] || ""}
                                  </span>
                                )}

                                {col.additional && item[col.additional] ? (
                                  <OverlayTrigger
                                    key={`overlay-additional-${colIndex}-${dataIndex}`}
                                    placement={"top"}
                                    overlay={
                                      <Tooltip
                                        id={`tooltip-${colIndex}-${dataIndex}`}
                                      >
                                        {item[col.additional]}
                                      </Tooltip>
                                    }
                                  >
                                    <Badge
                                      className="ml-1"
                                      style={{ fontWeight: "100" }}
                                      variant="dark"
                                    >
                                      <FaInfo size={8} />
                                    </Badge>
                                  </OverlayTrigger>
                                ) : null}
                              </td>
                            ); //////////////////List data
                          })}
                        {tools && tools.length > 0 ? (
                          <td
                            key={`td-toolsbar`}
                            className="align-middle text-center td-tools-button"
                          >
                            <ActionButtons
                              tools={tools}
                              item={item}
                              idKey={idKey}
                            />
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
              {/* <tfoot>
                <tr>&nbsp;</tr>
              </tfoot> */}
            </Table>
          </div>
        </Col>
      </Row>

      <Row>
        <Col />
        <Col />
        <Col>
          <Paginator
            page={page}
            pages={pages}
            pageChange={onPageChange}
            pageChangePrev={onPrevPage}
            pageChangeNext={onNextPage}
          />
        </Col>
      </Row>
    </div>
  );
};

const ActionButtons = ({ tools, item, idKey }) => {
  return (
    <ButtonToolbar aria-label="Toolbar with button groups">
      {tools.map((data, index) => {
        if (tools.length > 4 && index >= 2) {
          if (index === 2) {
            return (
              <DropdownButton
                key={`dropdown-button-${data.key}-${index}`}
                size="sm"
                title={<FaListUl />}
                id="bg-nested-dropdown"
                className="pea-color"
                variant="outline-secondary"
                drop="down"
                style={{ display: "inherit" }}
              >
                {tools.map((data1, index1) => {
                  if (index1 > 1) {
                    if (data1.toggle && item[data1.toggleVar]) {
                      return (
                        <Dropdown.Item
                          key={`dropdown-item-${data1.key}-${index1}`}
                          className="pea-color"
                          onClick={() =>
                            data1.variable
                              ? data1.onclickSecond(
                                  item[idKey],
                                  item[data1.variable]
                                )
                              : data1.onclickSecond(item[idKey])
                          }
                        >
                          {data1.iconSecond}
                          <span className="ml-2">
                            {data1.overlaytextSecond}
                          </span>
                        </Dropdown.Item>
                      );
                    }
                    return (
                      <Dropdown.Item
                        key={`dropdown-item-${data1.key}-${index1}`}
                        className="pea-color"
                        onClick={() =>
                          data1.variable
                            ? data1.onclick(item[idKey], item[data1.variable])
                            : data1.onclick(item[idKey])
                        }
                      >
                        {data1.icon}
                        <span className="ml-2">{data1.overlaytext}</span>
                      </Dropdown.Item>
                    );
                  }
                  return null;
                })}
              </DropdownButton>
            );
          }
          return null;
        }

        if (data.toggle && item[data.toggleVar]) {
          return (
            <OverlayTrigger
              key={`overlay-button-${data.key}-${index}`}
              placement={"top"}
              overlay={
                <Tooltip id={`tooltip-${data.key}-${index}`}>
                  {data.overlaytextSecond}
                </Tooltip>
              }
            >
              <Button
                key={`dropdown-item-${data.key}-${index}`}
                eventKey={`dropdown-item-${data.key}-${index}`}
                className="pea-color"
                onClick={() =>
                  data.variable
                    ? data.onclickSecond(item[idKey], item[data.variable])
                    : data.onclickSecond(item[idKey])
                }
              >
                {data.iconSecond}
              </Button>
            </OverlayTrigger>
          );
        }

        return (
          <OverlayTrigger
            key={`overlay-button-${data.key}-${index}`}
            placement={"top"}
            overlay={
              <Tooltip id={`tooltip-${data.key}-${index}`}>
                {data.overlaytext}
              </Tooltip>
            }
          >
            <Button
              key={`button-${data.key}`}
              variant={"outline-secondary"}
              size={"sm"}
              className={"pea-color"}
              onClick={() =>
                data.variable
                  ? data.onclick(item[idKey], item[data.variable])
                  : data.onclick(item[idKey])
              }
            >
              {data.icon}
            </Button>
          </OverlayTrigger>
        );
      })}
    </ButtonToolbar>
  );
};

export default DataTable;
