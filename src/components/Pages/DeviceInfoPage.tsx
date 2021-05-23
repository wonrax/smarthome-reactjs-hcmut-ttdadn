import React, { useCallback, useEffect, useRef, useState } from "react";
import { Icon, Box, Text, Button, InlineLoading } from "..";
import { InlineIcon } from "../InlineIcon";
import { ScheduledTask } from "..";
import { TitledPageTemplate } from "../Utils";
import { useParams } from "react-router";
import { baseURL, testUser } from "../api";
import axios, { AxiosResponse } from "axios";

type propsTypes = {};

export const DeviceInfoPage = (props: propsTypes) => {
  const [isScheduleEnabled, setScheduleEnabled] = useState<boolean>(false);
  const deviceInfo = (
    <InlineLoading kind="loading" message="Đang tải thông tin thiết bị..." />
  );
  const [isFetched, setFetched] = useState<boolean>(false);
  const [response, setResponse] = useState<AxiosResponse>();
  const [scheduleList, setScheduleList] =
    useState<JSX.Element[] | JSX.Element>(deviceInfo);

  // Keep reference to scheduleList state up to date
  const scheduleListRef = useRef<JSX.Element | JSX.Element[]>(scheduleList);

  const { device_id } = useParams<{ device_id: string }>();

  const toggleScheduleEnabled = () => {
    setScheduleEnabled(!isScheduleEnabled);
  };

  const handleOnDeleteSchedule = (id: string) => {
    if (!scheduleListRef.current || !Array.isArray(scheduleListRef.current))
      return;
    console.log(scheduleListRef.current.length);
    console.log(scheduleListRef.current);
    for (var i = 0; i < scheduleListRef.current.length; i++) {
      if (scheduleListRef.current[i].props.id === id) {
        const copyList = scheduleListRef.current.slice();
        copyList.splice(i, 1);
        scheduleListRef.current = copyList;
        setScheduleList(copyList);
        return;
      }
    }
  };

  useEffect(() => {
    document.title = "Device";
    console.log("useeffect fired");

    const url = baseURL + "/@" + testUser + "/devices/" + device_id;
    const fetchDeviceInfo = async function () {
      let response = await axios(url);
      setResponse(response);
      setFetched(true);
      setScheduleEnabled(response.data.mode !== 0 ? true : false);
    };
    fetchDeviceInfo();
  }, [device_id]);

  useEffect(() => {
    if (!isFetched) return;
    const list_ = response?.data.schedule.map(
      (schedule: any, index: number) => {
        return (
          <ScheduledTask
            key={index}
            id={index.toString()}
            enabledDays={schedule.repeat_day}
            isDefaultRepeat={schedule.is_repeat}
            timeRange={schedule.time_on + " - " + schedule.time_off}
            onDelete={handleOnDeleteSchedule}
          />
        );
      }
    );
    scheduleListRef.current = list_;
    setScheduleList(list_);
  }, [isFetched]);

  return (
    <TitledPageTemplate title="Thông tin thiết bị" scrollToTop>
      <>
        {isFetched ? (
          <>
            <Box margins="mb8">
              <Text kind="normal">{response?.data.device_name}</Text>
            </Box>
            <Box margins="mb32">
              <Text kind="normal" color="gray70">
                {response?.data.description}
              </Text>
            </Box>
            <Box margins="mb32">
              <Button
                text="Xem thống kê sử dụng"
                kind="secondary"
                iconPosition="left"
                iconName="Graph"
              />
            </Box>
            <Box margins="mb8">
              <Text kind="h3">Hẹn giờ</Text>
            </Box>
            <Box margins="mb8">
              <button
                onClick={toggleScheduleEnabled}
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <InlineIcon>
                  <Box wid="100" hei="100" margins="mr16">
                    <Text kind="normal">Kích hoạt tính năng hẹn giờ</Text>
                  </Box>
                  <Icon icon={isScheduleEnabled ? "Toggle-On" : "Toggle-Off"} />
                </InlineIcon>
              </button>
            </Box>
            <Box margins="mb32">
              <InlineIcon>
                <Icon icon="Info-Circle" />
                <Box margins="ml16">
                  <Text kind="normalcap" color="gray70">
                    Đèn sẽ được tự động bật/tắt theo danh sách lịch đã hẹn ở
                    dưới đây.
                  </Text>
                </Box>
              </InlineIcon>
            </Box>
            <Box margins="mb32">
              <Button text="Đặt lịch mới" iconPosition="left" iconName="Plus" />
            </Box>
            <Box>{scheduleList}</Box>
          </>
        ) : (
          deviceInfo
        )}
      </>
    </TitledPageTemplate>
  );
};
