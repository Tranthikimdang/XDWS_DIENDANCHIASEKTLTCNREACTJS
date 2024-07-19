import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chart from "react-apexcharts";
import {
  faUser,
  faFileAlt,
  faComment,
  faHandPointer,
} from "@fortawesome/free-solid-svg-icons";
import Card from "../../../../components/atoms/Card/Card";
import "./dashboard.css";

function Dashboard() {
  const chartConfig1 = {
    type: "bar",
    series: [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58, 80],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Thứ 2",
          "Thứ 3",
          "Thứ 4",
          "Thứ 5",
          "Thứ 6",
          "Thứ 7",
          "CN",
        ],
        labels: {
          show: true,
          style: {
            colors: "#fff",
            fontSize: "14px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 400,
            cssClass: "apexcharts-xaxis-label",
          },
        },
      },
      yaxis: {
        show: true,
        labels: {
          style: {
            colors: "#fff",
            fontSize: "14px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 400,
            cssClass: "apexcharts-yaxis-label",
          },
          formatter: function (value) {
            return value;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        enabled: false, // Tắt tooltip
      },
    },
  };
  const chartConfig2 = {
    type: "area",
    width: 500,
    height: 280,

    series: [
      {
        name: "Số bài viết mới",
        data: [1500, 1418, 1456, 1526, 1356, 1256, 2800],
        color: "#1A56DB",
      },
      {
        name: "Thành viên mới",
        data: [643, 413, 765, 412, 1423, 1731, 2200],
        color: "#7E3BF2",
      },
    ],
    options: {
      tooltip: {
        enabled: false, // Tắt tooltip
      },
      chart: {
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: false,
        },
      },
      title: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        labels: {
          colors: "#fff",
          useSeriesColors: false,
        },
      },
      xaxis: {
        categories: [
          "Thứ 2",
          "Thứ 3",
          "Thứ 4",
          "Thứ 5",
          "Thứ 6",
          "Thứ 7",
          "CN",
        ],
        labels: {
          show: true,
          style: {
            colors: "#fff",
            fontSize: "14px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 400,
            cssClass: "apexcharts-xaxis-label",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: true,
        stepSize: 500,
        labels: {
          style: {
            colors: "#fff",
            fontSize: "14px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 400,
            cssClass: "apexcharts-yaxis-label",
          },
          formatter: function (value) {
            return value;
          },
        },
      },
    },
  };
  return (
    <div style={{ marginTop: "20px" }}>
      <div className="flex">
        <Card customClass={"flex-1 gap flex-row align-center"}>
          <div className="card__left">
            <h3>Thành viên mới</h3>
            <strong>20</strong>
          </div>
          <div className="card__right">
            <FontAwesomeIcon icon={faUser} style={{ fontSize: "20px" }} />
          </div>
        </Card>

        <Card customClass={"flex-1 gap flex-row align-center"}>
          <div className="card__left">
            <h3>Bài viết mới</h3>
            <strong>20</strong>
          </div>
          <div className="card__right">
            <FontAwesomeIcon icon={faFileAlt} style={{ fontSize: "20px" }} />
          </div>
        </Card>

        <Card customClass={"flex-1 gap flex-row align-center"}>
          <div className="card__left">
            <h3>Số comment hôm nay</h3>
            <strong>20</strong>
          </div>
          <div className="card__right">
            <FontAwesomeIcon icon={faComment} style={{ fontSize: "20px" }} />
          </div>
        </Card>
        <Card customClass={"flex-1 gap flex-row align-center"}>
          <div className="card__left">
            <h3>Số người tương tác</h3>
            <strong>20</strong>
          </div>
          <div className="card__right">
            <FontAwesomeIcon icon={faUser} style={{ fontSize: "20px" }} />
          </div>
        </Card>
      </div>
      <div className="flex mt-8">
        <Card className="">
          <Chart {...chartConfig2} />
        </Card>

        <Card customClass={'flex-1 gap-2'}>
          <Chart {...chartConfig1} height={300} />
          <div className="list-info">
            <div className="info">
              <h6>
                <FontAwesomeIcon icon={faUser} /> User
              </h6>
              <span>50000</span>
            </div>
            <div className="info">
              <h6>
                <FontAwesomeIcon icon={faHandPointer} /> Click
              </h6>
              <span>50000</span>
            </div>
            <div className="info">
              <h6>
                <FontAwesomeIcon icon={faFileAlt} /> Bài viết
              </h6>
              <span>50000</span>
            </div>
            <div className="info">
              <h6>
                <FontAwesomeIcon icon={faComment} /> Comment
              </h6>
              <span>50000</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
