# Skin Detection Backend MVP

这是一个美容皮肤检测项目的后端 MVP，支持：

- 接收硬件设备上传的检测数据
- 保存检测记录到本地 SQLite 数据库
- 根据水分、油脂、温度、湿度、pH 做基础规则分析
- 返回皮肤状态、评分和护肤建议
- 给小程序、App、Web 前端提供 API
- 给 M5Stack / UIFlow2 温度设备提供专用接口

## 运行方式

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

启动后打开：

- API 文档：http://127.0.0.1:8000/docs
- 健康检查：http://127.0.0.1:8000/health

如果要让局域网里的 M5Stack 设备访问你的电脑，请这样启动：

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 通用检测接口

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/measurements" \
  -H "Content-Type: application/json" \
  -d "{\"device_id\":\"device-001\",\"user_id\":\"user-001\",\"skin_temperature_c\":33.8,\"skin_humidity_percent\":42,\"oil_level\":72,\"moisture_level\":31,\"ph_value\":5.6}"
```

## M5Stack / UIFlow2 温度设备专用接口

这个接口适合只上传温度，或温度加湿度的 M5Stack 设备。

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/devices/m5stack/temperature" \
  -H "Content-Type: application/json" \
  -d "{\"device_id\":\"m5-temperature-001\",\"temperature_c\":33.6,\"humidity_percent\":42.0,\"firmware_version\":\"1.0.0\",\"wifi_rssi\":-58}"
```

请求体字段：

| 字段 | 说明 |
| --- | --- |
| `device_id` | M5Stack 设备 ID，必填 |
| `temperature_c` | 温度值，必填 |
| `humidity_percent` | 湿度值，可选 |
| `user_id` | 用户 ID，可选 |
| `firmware_version` | 固件版本，可选 |
| `wifi_rssi` | Wi-Fi 信号强度，可选 |
| `sensor_type` | 传感器类型，可选，默认 `temperature` |
| `source` | 数据来源，可选，默认 `uiflow2` |
| `raw_payload` | 设备原始附加数据，可选 |

## 给小白的最简单接法

1. 电脑启动后端：

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

2. 电脑和 M5Stack 都连接同一个手机热点。

3. 在电脑里运行 `ipconfig`，找到当前 IPv4 地址。

4. 打开示例文件：

```text
m5stack_uiflow2_temperature_example.py
```

5. 把这 3 行改成你自己的值：

```python
SSID = "你的热点名"
PASSWORD = "你的热点密码"
API_URL = "http://你的电脑IP:8000/api/v1/devices/m5stack/temperature"
```

6. 在 UIFlow2 里切到 `</>` 代码模式，把示例文件内容粘贴进去运行。

## UIFlow2 推荐上传格式

```json
{
  "device_id": "m5-temperature-001",
  "temperature_c": 33.6,
  "humidity_percent": 42.0,
  "firmware_version": "1.0.0",
  "wifi_rssi": -58,
  "sensor_type": "temperature",
  "source": "uiflow2"
}
```

## 查询检测记录

```bash
curl "http://127.0.0.1:8000/api/v1/measurements"
```

## 当前通用数据字段

| 字段 | 说明 |
| --- | --- |
| `device_id` | 硬件设备 ID |
| `user_id` | 用户 ID，可为空 |
| `skin_temperature_c` | 皮肤表面温度，摄氏度 |
| `skin_humidity_percent` | 湿度百分比 |
| `oil_level` | 油脂水平，0-100 |
| `moisture_level` | 水分水平，0-100 |
| `ph_value` | pH 值，0-14 |
| `raw_payload` | 原始硬件数据，可选 |

## 后续可以扩展

- 接入 MQTT，适合 IoT 设备持续上传数据
- 增加用户登录和设备绑定
- 增加检测报告 PDF
- 增加管理后台
- 将 SQLite 替换为 PostgreSQL
- 将规则分析升级为机器学习模型
