import { useEffect } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Briefcase,
  Check,
  ChevronDown,
  DollarSign,
  Folder,
  Gamepad2,
  GraduationCap,
  Heart,
  HeartPulse,
  Lightbulb,
  Music,
  Palette,
  PanelLeftClose,
  Plane,
  Save,
  Shirt,
  Smartphone,
  Sparkles,
  Trophy,
  UserCircle,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";

export default function App() {
  return (
    <div>
      <div
        className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
        style={{
          display: "flex",
          fontFamily: "system-ui, -apple-system, sans-serif",
          minHeight: "1080px",
        }}
        data-id="9cd03898-2ad0-59ff-b57c-76bf02ca1a5b"
      >
        <aside
          className="bg-neutral-900 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex flex-col"
          style={{ flexShrink: 0, minHeight: "1080px", width: "272px" }}
          data-id="2fb690e9-8397-570d-ae8f-848424921f51"
        >
          <div
            className="flex p-6 justify-between items-center"
            data-id="86695824-a474-5682-af3b-bb7dc44e0e97"
          >
            <div
              className="flex items-center gap-2"
              data-id="b7f2c16a-e14d-5889-852d-549a56238107"
            >
              <span
                className="text-neutral-50"
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
                data-id="2ec698c9-53e2-51d3-afdc-b9d1177584b3"
              >
                MONOLITH
                <span
                  style={{ color: "#4A6CF7" }}
                  data-id="414ac9c9-635f-55df-aa6d-35c6898ff770"
                >
                  _AI
                </span>
              </span>
            </div>
            <button
              className="rounded-sm p-1"
              data-id="d2942b07-4c54-55b6-ad10-3f1bcfd98cd7"
            >
              <PanelLeftClose
                className="size-4 text-[#a1a1a1]"
                data-id="62078418-9fec-5729-867f-a9d72589ed9a"
              />
            </button>
          </div>
          <div
            className="px-4 pb-4"
            data-id="fd7850e2-db32-5158-9cd6-9f3cc0dd3cf7"
          >
            <div
              style={{
                background: "rgba(74,108,247,0.08)",
                border: "1px solid rgba(74,108,247,0.2)",
                borderRadius: "10px",
                padding: "12px 14px",
              }}
              data-id="cdc89a21-8cbb-5dd8-be67-0e2a53ce13e1"
            >
              <div
                className="flex items-center gap-2"
                style={{ marginBottom: "6px" }}
                data-id="c121c9cc-1017-59fd-8eee-6a43761e66e9"
              >
                <div
                  style={{
                    alignItems: "center",
                    background: "linear-gradient(135deg,#4A6CF7,#6C5CE7)",
                    borderRadius: "8px",
                    display: "flex",
                    height: "28px",
                    justifyContent: "center",
                    width: "28px",
                  }}
                  data-id="46f9bef7-3841-57bf-969b-f60c4bcafb04"
                >
                  <Folder
                    className="size-3.5"
                    style={{ color: "#fff" }}
                    data-id="36f1b781-7924-509d-bb10-cd5f0e3df771"
                  />
                </div>
                <div data-id="65ec628c-0acb-5a0b-a2b4-0fc14e65458e">
                  <p
                    className="text-neutral-50"
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      lineHeight: "1.2",
                    }}
                    data-id="8aabec31-11e0-58db-a12d-99ffc12374ca"
                  >
                    FinTrack
                  </p>
                  <p
                    className="text-[#a1a1a1]"
                    style={{ fontSize: "11px", lineHeight: "1.2" }}
                    data-id="76e41e74-1beb-565a-b134-af0a247da6fb"
                  >
                    In Progress
                  </p>
                </div>
              </div>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  gap: "6px",
                  marginTop: "8px",
                }}
                data-id="5ee1d0f3-a70c-5806-8ab1-e1282e1792ec"
              >
                <div
                  style={{
                    background: "#2A2A3A",
                    borderRadius: "4px",
                    flex: 1,
                    height: "3px",
                  }}
                  data-id="5ce5453a-3648-5ebe-ba3b-6085c5ea9562"
                >
                  <div
                    style={{
                      background: "linear-gradient(90deg,#4A6CF7,#6C5CE7)",
                      borderRadius: "4px",
                      height: "100%",
                      width: "18%",
                    }}
                    data-id="2a3e01e2-a062-5cdf-ada1-d8ed20acf793"
                  />
                </div>
                <span
                  className="text-[#a1a1a1]"
                  style={{ fontSize: "10px", fontWeight: 500 }}
                  data-id="5f00874e-9604-572f-98f6-9dd7523a7fba"
                >
                  2/11
                </span>
              </div>
            </div>
          </div>
          <div
            className="px-4 pb-2"
            data-id="d47ff99d-4d83-5ec6-badb-26161c2a047d"
          >
            <p
              className="text-[#a1a1a1]"
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "1px",
                marginBottom: "8px",
                paddingLeft: "8px",
                textTransform: "uppercase",
              }}
              data-id="212e982a-5a94-5c17-9296-6ee8cb2461a8"
            >
              Steps
            </p>
          </div>
          <nav
            className="overflow-y-auto flex px-4 flex-col flex-1 gap-0.5"
            style={{ paddingBottom: "12px" }}
            data-id="8f18da9f-f9c4-560f-8819-1dfcd83af049"
          >
            <a
              className="rounded-lg text-sm leading-5 flex px-3 py-2 items-center gap-2.5"
              data-id="8e7de029-b1ce-5afa-87a3-7f7978fe4309"
            >
              <div
                style={{
                  alignItems: "center",
                  background: "#4ADE80",
                  borderRadius: "50%",
                  color: "#fff",
                  display: "flex",
                  flexShrink: 0,
                  fontSize: "11px",
                  fontWeight: 700,
                  height: "22px",
                  justifyContent: "center",
                  width: "22px",
                }}
                data-id="92e76d6d-4dd6-58c2-9288-6eebb4edfd3b"
              >
                <Check
                  className="size-3"
                  style={{ color: "#fff" }}
                  data-id="f4cee4bf-9641-52a5-8230-66ad2181ce4e"
                />
              </div>
              <span
                className="text-[#a1a1a1]"
                style={{ fontSize: "13px", fontWeight: 500 }}
                data-id="8e478a33-3ebf-561b-8828-304fe6aa9f7d"
              >
                Project Understanding
              </span>
            </a>
            <a
              className="rounded-lg text-sm leading-5 flex px-3 py-2 items-center gap-2.5"
              style={{
                background: "rgba(74,108,247,0.12)",
                border: "1px solid rgba(74,108,247,0.25)",
              }}
              data-id="399cd138-198b-5a21-92c0-7c81bde67c4b"
            >
              <div
                style={{
                  alignItems: "center",
                  background: "#4A6CF7",
                  borderRadius: "50%",
                  boxShadow: "0 0 8px rgba(74,108,247,0.4)",
                  color: "#fff",
                  display: "flex",
                  flexShrink: 0,
                  fontSize: "11px",
                  fontWeight: 700,
                  height: "22px",
                  justifyContent: "center",
                  width: "22px",
                }}
                data-id="e606d4c2-7134-5ccb-9e17-502b4b4d2483"
              >
                2
              </div>
              <span
                className="text-neutral-50"
                style={{ fontSize: "13px", fontWeight: 500 }}
                data-id="403b1255-a16f-5c99-ada2-ed8a3caedccb"
              >
                Target Audience
              </span>
            </a>
            <a
              className="rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-2.5"
              data-id="1083c9be-2822-5339-af8f-e1fe698ecadf"
            >
              <div
                style={{
                  alignItems: "center",
                  border: "1.5px solid #2A2A3A",
                  borderRadius: "50%",
                  color: "oklch(0.708 0 0)",
                  display: "flex",
                  flexShrink: 0,
                  fontSize: "11px",
                  height: "22px",
                  justifyContent: "center",
                  width: "22px",
                }}
                data-id="dfe70c10-5bf1-5347-be9c-eb0dc87f0818"
              >
                3
              </div>
              <span
                style={{ fontSize: "13px" }}
                data-id="719e06a3-0d81-5c2a-b770-4044bd1d5013"
              >
                User Personas
              </span>
            </a>
            <a
              className="rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-2.5"
              data-id="6e9a791b-da76-5b25-bcaa-b871619ab52f"
            >
              <div
                style={{
                  alignItems: "center",
                  border: "1.5px solid #2A2A3A",
                  borderRadius: "50%",
                  color: "oklch(0.708 0 0)",
                  display: "flex",
                  flexShrink: 0,
                  fontSize: "11px",
                  height: "22px",
                  justifyContent: "center",
                  width: "22px",
                }}
                data-id="213e764b-3bb0-5209-ba57-0d55b1a93f69"
              >
                4
              </div>
              <span
                style={{ fontSize: "13px" }}
                data-id="e2a31b80-8b12-5385-baa7-a377e8aa91ad"
              >
                Competitive Analysis
              </span>
            </a>
            <a
              className="rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-2.5"
              data-id="f3c0f27a-274e-514c-9600-950df9844ebc"
            >
              <div
                style={{
                  alignItems: "center",
                  border: "1.5px solid #2A2A3A",
                  borderRadius: "50%",
                  color: "oklch(0.708 0 0)",
                  display: "flex",
                  flexShrink: 0,
                  fontSize: "11px",
                  height: "22px",
                  justifyContent: "center",
                  width: "22px",
                }}
                data-id="db611170-9850-582e-b851-ee628753eb9c"
              >
                5
              </div>
              <span
                style={{ fontSize: "13px" }}
                data-id="4f3fcb89-c496-51c9-ae34-05dbb05f68c2"
              >
                User Flows
              </span>
            </a>
            <a
              className="rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-2.5"
              data-id="ffd98b58-7df8-5d62-bd45-45928e199794"
            >
              <div
                style={{
                  alignItems: "center",
                  border: "1.5px solid #2A2A3A",
                  borderRadius: "50%",
                  color: "oklch(0.708 0 0)",
                  display: "flex",
                  flexShrink: 0,
                  fontSize: "11px",
                  height: "22px",
                  justifyContent: "center",
                  width: "22px",
                }}
                data-id="97c50600-9b03-5a05-b6cc-7d1d2a67289e"
              >
                6
              </div>
              <span
                style={{ fontSize: "13px" }}
                data-id="b7885122-b6b3-5b46-aa0f-bb41747a4232"
              >
                Feature Prioritization
              </span>
            </a>
            <a
              className="rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-2.5"
              data-id="18ed1172-ce29-5f1d-8863-8ce6a3c4c4bd"
            >
              <div
                style={{
                  alignItems: "center",
                  border: "1.5px solid #2A2A3A",
                  borderRadius: "50%",
                  color: "oklch(0.708 0 0)",
                  display: "flex",
                  flexShrink: 0,
                  fontSize: "11px",
                  height: "22px",
                  justifyContent: "center",
                  width: "22px",
                }}
                data-id="37a8a130-8a72-5fae-b5fb-a22b121e051e"
              >
                7
              </div>
              <span
                style={{ fontSize: "13px" }}
                data-id="05b04115-ebbd-53b8-8448-7e2029f57310"
              >
                Information Architecture
              </span>
            </a>
            <a
              className="rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-2.5"
              data-id="6bd6c139-c1ec-55ab-ae59-1686d5835174"
            >
              <div
                style={{
                  alignItems: "center",
                  border: "1.5px solid #2A2A3A",
                  borderRadius: "50%",
                  color: "oklch(0.708 0 0)",
                  display: "flex",
                  flexShrink: 0,
                  fontSize: "11px",
                  height: "22px",
                  justifyContent: "center",
                  width: "22px",
                }}
                data-id="be41dd19-c79c-5608-ab46-e1d7919a72e5"
              >
                8
              </div>
              <span
                style={{ fontSize: "13px" }}
                data-id="e3c66990-0441-521f-948f-86e0e2202e25"
              >
                Wireframes
              </span>
            </a>
            <a
              className="rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-2.5"
              data-id="9492845c-f9a5-5ccb-9d04-46fbcf70b21c"
            >
              <div
                style={{
                  alignItems: "center",
                  border: "1.5px solid #2A2A3A",
                  borderRadius: "50%",
                  color: "oklch(0.708 0 0)",
                  display: "flex",
                  flexShrink: 0,
                  fontSize: "11px",
                  height: "22px",
                  justifyContent: "center",
                  width: "22px",
                }}
                data-id="7675e94a-5fc0-5681-a387-3a686e37d006"
              >
                9
              </div>
              <span
                style={{ fontSize: "13px" }}
                data-id="94c3c65d-08cf-5677-a4f7-ab541d315243"
              >
                Visual Design Preferences
              </span>
            </a>
            <a
              className="rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-2.5"
              data-id="607dbcac-5f58-5709-937e-f191f7b5f68a"
            >
              <div
                style={{
                  alignItems: "center",
                  border: "1.5px solid #2A2A3A",
                  borderRadius: "50%",
                  color: "oklch(0.708 0 0)",
                  display: "flex",
                  flexShrink: 0,
                  fontSize: "10px",
                  height: "22px",
                  justifyContent: "center",
                  width: "22px",
                }}
                data-id="efd5c6c3-6f93-5d4b-bde1-02fe35681978"
              >
                10
              </div>
              <span
                style={{ fontSize: "13px" }}
                data-id="6bfa6fc7-5120-5626-9b79-34ce31645169"
              >
                Content Strategy
              </span>
            </a>
            <a
              className="rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-2.5"
              data-id="bb65f87e-4a07-5568-abdc-750e7ccb672c"
            >
              <div
                style={{
                  alignItems: "center",
                  border: "1.5px solid #2A2A3A",
                  borderRadius: "50%",
                  color: "oklch(0.708 0 0)",
                  display: "flex",
                  flexShrink: 0,
                  fontSize: "10px",
                  height: "22px",
                  justifyContent: "center",
                  width: "22px",
                }}
                data-id="e69f6751-e72e-5172-9f44-dc2e2cbb791a"
              >
                11
              </div>
              <span
                style={{ fontSize: "13px" }}
                data-id="ec5dd704-58ce-5088-97da-5619854f9073"
              >
                Review &amp; Generate
              </span>
            </a>
          </nav>
          <div
            className="px-4 pb-4"
            data-id="bcbb499d-d3dc-5e39-a89c-9ecb8a0ca7a5"
          >
            <div
              style={{
                background: "oklch(0.205 0 0)",
                border: "1px solid oklch(1 0 0 / 10%)",
                borderRadius: "10px",
                padding: "12px 14px",
              }}
              data-id="db5de9c9-026a-59c4-af9b-5c482784dfb6"
            >
              <div
                className="flex items-center gap-2"
                style={{ marginBottom: "8px" }}
                data-id="8a541fcc-dda5-5bfe-bf66-8bb9c7030315"
              >
                <Lightbulb
                  className="size-4"
                  style={{ color: "#FBBF24" }}
                  data-id="ac3b40d8-f8ee-5b49-a014-88d6e4726e0b"
                />
                <span
                  className="text-neutral-50"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                  data-id="c3f9d794-fa36-5b98-8a59-d9f45fa30f8f"
                >
                  Tip for this step
                </span>
              </div>
              <p
                className="text-[#a1a1a1]"
                style={{ fontSize: "11px", lineHeight: "1.5" }}
                data-id="ce2d6cd1-8e2f-53ac-abb5-ce5e788fb643"
              >
                Define your audience precisely. The more specific your
                demographics and interests, the better the AI can tailor
                personas and user flows in later steps.
              </p>
            </div>
          </div>
          <div
            className="border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid p-4"
            data-id="65439108-8d80-5237-bd46-8ea1e2afcdf9"
          >
            <div
              className="flex p-2 items-center gap-2"
              data-id="ef06b665-fc86-58fe-a670-3de58cc7ae06"
            >
              <div
                className="text-neutral-50"
                style={{
                  alignItems: "center",
                  background: "linear-gradient(135deg,#4A6CF7,#6C5CE7)",
                  borderRadius: "50%",
                  display: "flex",
                  fontSize: "12px",
                  fontWeight: 600,
                  height: "32px",
                  justifyContent: "center",
                  width: "32px",
                }}
                data-id="02561075-c4e0-5496-bcc5-cc07af4133f7"
              >
                JD
              </div>
              <div
                className="flex flex-col"
                data-id="1c82223b-a9e2-5559-8925-3cf5ab06422c"
              >
                <span
                  className="font-medium text-neutral-50 text-sm leading-5"
                  data-id="06fb80a8-f979-53e3-9239-806ab3e1ff04"
                >
                  John Doe
                </span>
                <span
                  className="text-[#a1a1a1]"
                  style={{ fontSize: "11px" }}
                  data-id="8c59cb68-40e1-548f-bab4-b508bdabd9e5"
                >
                  john@monolith.ai
                </span>
              </div>
            </div>
          </div>
        </aside>
        <div
          className="flex flex-col flex-1"
          style={{ minHeight: "1080px" }}
          data-id="5bec0bb1-9bdc-5beb-8f82-8d3e3104aad2"
        >
          <div
            className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex px-8 py-4 justify-between items-center"
            data-id="212c7317-4531-5e2c-87a4-400e24fa2a55"
          >
            <button
              className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2"
              data-id="8670f939-f804-5cc3-aa4f-d9914d4aa8ff"
            >
              <ArrowLeft
                className="size-4"
                data-id="981440e4-ffea-5431-91a7-6ae47bfaa45c"
              />
              <span data-id="63bb2a70-d21c-5a69-8309-5f72ffc11575">
                Back to Dashboard
              </span>
            </button>
            <div
              className="flex items-center gap-4"
              data-id="252dfa7c-6027-5047-b8d8-be4a80f54c1b"
            >
              <button
                className="rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-4 py-2 items-center gap-2"
                data-id="1fd85023-a7f7-54db-9074-28f07dfb56f9"
              >
                <Save
                  className="size-4"
                  data-id="22cb2df3-3fba-53d3-8f29-fe00c8aa9207"
                />
                <span data-id="3b8cf140-42c0-5731-a30a-4374b3f36d37">
                  Save Draft
                </span>
              </button>
              <div
                className="text-neutral-50"
                style={{
                  alignItems: "center",
                  background: "linear-gradient(135deg,#4A6CF7,#6C5CE7)",
                  borderRadius: "50%",
                  display: "flex",
                  fontSize: "12px",
                  fontWeight: 600,
                  height: "32px",
                  justifyContent: "center",
                  width: "32px",
                }}
                data-id="983e3916-cc92-5b14-b4ab-7d33feb6948f"
              >
                JD
              </div>
            </div>
          </div>
          <div
            className="px-8 py-6"
            data-id="b4440d09-f978-58a3-9310-77ada194f76f"
          >
            <div
              className="flex mb-2 items-center gap-2"
              data-id="03f2a73b-e0b6-5a4a-9449-194784c946c5"
            >
              <div
                className="flex items-center gap-0"
                style={{ margin: "0 auto", maxWidth: "900px", width: "100%" }}
                data-id="02fbd226-3c74-56fb-91b4-f06c61b2d164"
              >
                <div
                  className="text-neutral-50"
                  style={{
                    alignItems: "center",
                    background: "#4ADE80",
                    borderRadius: "50%",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: "12px",
                    fontWeight: 700,
                    height: "32px",
                    justifyContent: "center",
                    width: "32px",
                  }}
                  data-id="61ffd5ab-0883-553c-9a63-c1af7ad16351"
                >
                  <Check
                    className="size-4"
                    style={{ color: "#fff" }}
                    data-id="ebcb3b4a-0fd7-500a-a63b-4e87f2bd9481"
                  />
                </div>
                <div
                  style={{
                    background:
                      "linear-gradient(90deg,#4ADE80 0%,#4ADE80 100%)",
                    flex: 1,
                    height: "2px",
                  }}
                  data-id="87afe0e8-af46-5d5c-ba18-69a89bba5970"
                />
                <div
                  className="text-neutral-50"
                  style={{
                    alignItems: "center",
                    background: "#4A6CF7",
                    borderRadius: "50%",
                    boxShadow: "0 0 12px rgba(74,108,247,0.5)",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: "12px",
                    fontWeight: 700,
                    height: "32px",
                    justifyContent: "center",
                    width: "32px",
                  }}
                  data-id="7626424f-5111-5b1f-aecc-de571399f91b"
                >
                  2
                </div>
                <div
                  style={{
                    background:
                      "linear-gradient(90deg,rgba(74,108,247,0.2) 0%,#2A2A3A 10%)",
                    flex: 1,
                    height: "2px",
                  }}
                  data-id="b43c782f-6c0e-5bd6-9a79-9a4471a49ae1"
                />
                <div
                  className="text-[#a1a1a1]"
                  style={{
                    alignItems: "center",
                    border: "1.5px solid #2A2A3A",
                    borderRadius: "50%",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: "11px",
                    height: "28px",
                    justifyContent: "center",
                    width: "28px",
                  }}
                  data-id="1ea84e32-0a62-5ad7-a0c0-a2396c8035f1"
                >
                  3
                </div>
                <div
                  style={{ background: "#2A2A3A", flex: 1, height: "2px" }}
                  data-id="1dc75ad2-ccfb-557e-90f9-fbb5486548d6"
                />
                <div
                  className="text-[#a1a1a1]"
                  style={{
                    alignItems: "center",
                    border: "1.5px solid #2A2A3A",
                    borderRadius: "50%",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: "11px",
                    height: "28px",
                    justifyContent: "center",
                    width: "28px",
                  }}
                  data-id="b5bbd8cd-bf39-5cf4-a0e5-e359c8c5890f"
                >
                  4
                </div>
                <div
                  style={{ background: "#2A2A3A", flex: 1, height: "2px" }}
                  data-id="b68b6b68-9ec3-5e65-abef-eab63b83b267"
                />
                <div
                  className="text-[#a1a1a1]"
                  style={{
                    alignItems: "center",
                    border: "1.5px solid #2A2A3A",
                    borderRadius: "50%",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: "11px",
                    height: "28px",
                    justifyContent: "center",
                    width: "28px",
                  }}
                  data-id="ec5b3a87-a23b-56df-8fcf-4d3ff31d8a1d"
                >
                  5
                </div>
                <div
                  style={{ background: "#2A2A3A", flex: 1, height: "2px" }}
                  data-id="07d582fa-4258-5f65-95cd-d15112fcc38e"
                />
                <div
                  className="text-[#a1a1a1]"
                  style={{
                    alignItems: "center",
                    border: "1.5px solid #2A2A3A",
                    borderRadius: "50%",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: "11px",
                    height: "28px",
                    justifyContent: "center",
                    width: "28px",
                  }}
                  data-id="31919027-751a-5277-893d-fb80ca3bc33f"
                >
                  6
                </div>
                <div
                  style={{ background: "#2A2A3A", flex: 1, height: "2px" }}
                  data-id="0ac95fbc-b59e-5a88-8ebe-89a778a85050"
                />
                <div
                  className="text-[#a1a1a1]"
                  style={{
                    alignItems: "center",
                    border: "1.5px solid #2A2A3A",
                    borderRadius: "50%",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: "11px",
                    height: "28px",
                    justifyContent: "center",
                    width: "28px",
                  }}
                  data-id="b736a1dc-9ed4-54b8-b10c-533f73c464c0"
                >
                  7
                </div>
                <div
                  style={{ background: "#2A2A3A", flex: 1, height: "2px" }}
                  data-id="4db4dd7d-342d-57b9-8889-984a6543576d"
                />
                <div
                  className="text-[#a1a1a1]"
                  style={{
                    alignItems: "center",
                    border: "1.5px solid #2A2A3A",
                    borderRadius: "50%",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: "11px",
                    height: "28px",
                    justifyContent: "center",
                    width: "28px",
                  }}
                  data-id="23effc0d-ed24-5172-9f68-b08396fac2d7"
                >
                  8
                </div>
                <div
                  style={{ background: "#2A2A3A", flex: 1, height: "2px" }}
                  data-id="6ef589e9-5700-5737-9379-848be8a4c5fe"
                />
                <div
                  className="text-[#a1a1a1]"
                  style={{
                    alignItems: "center",
                    border: "1.5px solid #2A2A3A",
                    borderRadius: "50%",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: "11px",
                    height: "28px",
                    justifyContent: "center",
                    width: "28px",
                  }}
                  data-id="5dcb9b2c-2444-5edb-b2af-b070de4d06b3"
                >
                  9
                </div>
                <div
                  style={{ background: "#2A2A3A", flex: 1, height: "2px" }}
                  data-id="f0a81f84-8366-5aa8-a812-3005ac659ac8"
                />
                <div
                  className="text-[#a1a1a1]"
                  style={{
                    alignItems: "center",
                    border: "1.5px solid #2A2A3A",
                    borderRadius: "50%",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: "11px",
                    height: "28px",
                    justifyContent: "center",
                    width: "28px",
                  }}
                  data-id="e39c8ff0-5bca-52f9-9afb-2066f47a9407"
                >
                  10
                </div>
                <div
                  style={{ background: "#2A2A3A", flex: 1, height: "2px" }}
                  data-id="1ec78807-217c-5bef-a2bb-15d62006767f"
                />
                <div
                  className="text-[#a1a1a1]"
                  style={{
                    alignItems: "center",
                    border: "1.5px solid #2A2A3A",
                    borderRadius: "50%",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: "11px",
                    height: "28px",
                    justifyContent: "center",
                    width: "28px",
                  }}
                  data-id="52c11265-fe3b-5eda-8207-25ce10b08cb3"
                >
                  11
                </div>
              </div>
            </div>
            <p
              className="text-center text-[#a1a1a1] text-sm leading-5"
              style={{ marginTop: "8px" }}
              data-id="142218a6-172e-5a91-95e9-44f26d68fba7"
            >
              Step 2 of 11 — Target Audience
            </p>
          </div>
          <div
            className="flex px-8 pb-4 flex-1 gap-8"
            style={{ minHeight: "0" }}
            data-id="6618eac3-443c-5268-bcc3-7c12b5e6d0a5"
          >
            <div
              style={{
                flex: "0 0 55%",
                overflowY: "auto",
                paddingRight: "16px",
                paddingBottom: "80px",
              }}
              data-id="a3bd22f5-45c6-5790-be51-d1ae56cf349a"
            >
              <div
                className="mb-6"
                data-id="3f624a5a-359b-5783-a96f-65f07c4abaa4"
              >
                <h1
                  className="text-neutral-50 mb-2"
                  style={{ fontSize: "28px", fontWeight: 600 }}
                  data-id="4a4a0856-e0b8-577e-8c24-3115f36514e7"
                >
                  Define your target audience
                </h1>
                <p
                  className="text-[#a1a1a1] text-sm leading-5 mb-4"
                  data-id="0c744dcd-a386-526c-a9ab-e3f528b3f4e3"
                >
                  Help the AI understand who your product is for. Detailed
                  audience data leads to more accurate personas and user flows.
                </p>
                <div
                  style={{
                    alignItems: "center",
                    background: "rgba(74,108,247,0.15)",
                    border: "1px solid rgba(74,108,247,0.3)",
                    borderRadius: "20px",
                    display: "inline-flex",
                    gap: "6px",
                    padding: "6px 14px",
                  }}
                  data-id="2edae325-a53c-5b7a-8738-0f69231b25e9"
                >
                  <Users
                    className="size-4"
                    style={{ color: "#4A6CF7" }}
                    data-id="5fdd2cdf-206e-5020-96d0-2b420eb83463"
                  />
                  <span
                    style={{
                      color: "#7B9CFF",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                    data-id="609434ea-5bd4-5839-b51b-290e5cd58af8"
                  >
                    AI will generate personas from this data
                  </span>
                </div>
              </div>
              <div
                className="flex flex-col gap-6"
                style={{ marginTop: "16px" }}
                data-id="c6b187d4-8f5d-5c7f-a3ff-59bf9719c2fd"
              >
                <div
                  style={{
                    background: "#16162A",
                    border: "1px solid #2A2A3A",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                  data-id="c94582ff-7b08-502e-b5a1-f4fc2211bc80"
                >
                  <div
                    className="flex mb-4 items-center gap-2"
                    data-id="18587d98-d81a-5e72-8ef9-a30da3214620"
                  >
                    <UserCircle
                      className="size-5"
                      style={{ color: "#4A6CF7" }}
                      data-id="6306e4a2-db97-5003-8afe-8ffeed096c96"
                    />
                    <h3
                      className="text-neutral-50"
                      style={{ fontSize: "16px", fontWeight: 600 }}
                      data-id="8e1a9719-466c-5ddd-acc2-b78715cc90bd"
                    >
                      Demographics
                    </h3>
                  </div>
                  <div
                    className="flex flex-col gap-4"
                    data-id="e54c0e3e-1c90-563b-99fd-6594c3b382cd"
                  >
                    <div data-id="e143ef29-436d-57b4-9966-ea308a9f6aff">
                      <label
                        className="block font-medium text-neutral-50 text-sm leading-5 mb-2"
                        data-id="5d020c70-4584-5973-b11f-917cc9a87024"
                      >
                        Age Range
                      </label>
                      <div
                        className="flex items-center gap-4"
                        data-id="a4916070-5395-53c3-ba46-0623e8e0b680"
                      >
                        <div
                          style={{
                            flex: 1,
                            position: "relative",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          data-id="aab69490-e6f1-513a-9ff2-64b8c893f22e"
                        >
                          <div
                            style={{
                              background: "#2A2A3A",
                              borderRadius: "4px",
                              height: "4px",
                              width: "100%",
                              position: "relative",
                            }}
                            data-id="f938bac4-c2e4-5d8e-b5e7-37e3f38acc8d"
                          >
                            <div
                              style={{
                                background:
                                  "linear-gradient(90deg,#4A6CF7,#6C5CE7)",
                                borderRadius: "4px",
                                height: "100%",
                                position: "absolute",
                                left: "18%",
                                width: "42%",
                              }}
                              data-id="5b785ffe-69b8-5d66-8ea6-51d9d1245694"
                            />
                            <div
                              style={{
                                background: "#4A6CF7",
                                borderRadius: "50%",
                                border: "3px solid #16162A",
                                boxShadow: "0 0 8px rgba(74,108,247,0.4)",
                                height: "18px",
                                width: "18px",
                                position: "absolute",
                                left: "18%",
                                top: "50%",
                                transform: "translate(-50%,-50%)",
                              }}
                              data-id="793ca9fa-66a2-5878-8e75-819082b8a820"
                            />
                            <div
                              style={{
                                background: "#6C5CE7",
                                borderRadius: "50%",
                                border: "3px solid #16162A",
                                boxShadow: "0 0 8px rgba(108,92,231,0.4)",
                                height: "18px",
                                width: "18px",
                                position: "absolute",
                                left: "60%",
                                top: "50%",
                                transform: "translate(-50%,-50%)",
                              }}
                              data-id="5fc3277a-2d8f-50e1-86e6-05c0a8e18148"
                            />
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-2"
                          data-id="c1633c03-20f2-502a-931c-ac60b94c6f71"
                        >
                          <div
                            style={{
                              background: "#0A0A0F",
                              border: "1px solid #2A2A3A",
                              borderRadius: "8px",
                              padding: "6px 12px",
                              minWidth: "52px",
                              textAlign: "center",
                            }}
                            data-id="f6de769c-8bfc-57e8-b066-17c241c73e80"
                          >
                            <span
                              className="text-neutral-50"
                              style={{ fontSize: "14px", fontWeight: 500 }}
                              data-id="4bdcb364-ac35-5d7f-ba32-0b241d98f868"
                            >
                              18
                            </span>
                          </div>
                          <span
                            className="text-[#a1a1a1]"
                            style={{ fontSize: "13px" }}
                            data-id="e332320e-2d07-5131-8ac3-a432e0544b0c"
                          >
                            —
                          </span>
                          <div
                            style={{
                              background: "#0A0A0F",
                              border: "1px solid #2A2A3A",
                              borderRadius: "8px",
                              padding: "6px 12px",
                              minWidth: "52px",
                              textAlign: "center",
                            }}
                            data-id="bfc17e8d-3ce4-5ef2-8e35-4dc34fd70b26"
                          >
                            <span
                              className="text-neutral-50"
                              style={{ fontSize: "14px", fontWeight: 500 }}
                              data-id="5f15c370-b3e2-5af4-9b38-61b3bbfcd8cc"
                            >
                              35
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-id="9d76aa2c-3c05-5d57-8414-dbe7f11aaac3">
                      <label
                        className="block font-medium text-neutral-50 text-sm leading-5 mb-2"
                        data-id="076288f5-a011-5517-a888-285d52cf5046"
                      >
                        Gender
                      </label>
                      <div
                        className="flex items-center gap-2"
                        data-id="d7452b33-083e-5052-974b-9398019d20ff"
                      >
                        <div
                          style={{
                            background: "rgba(74,108,247,0.15)",
                            border: "1px solid rgba(74,108,247,0.4)",
                            borderRadius: "8px",
                            padding: "8px 16px",
                            cursor: "pointer",
                          }}
                          data-id="829d5dd0-f790-5e20-aa4d-952e68a16f78"
                        >
                          <span
                            style={{
                              color: "#7B9CFF",
                              fontSize: "13px",
                              fontWeight: 500,
                            }}
                            data-id="b9d6664a-4a43-53bb-aa93-6ae4a560e1ac"
                          >
                            All
                          </span>
                        </div>
                        <div
                          style={{
                            background: "transparent",
                            border: "1px solid #2A2A3A",
                            borderRadius: "8px",
                            padding: "8px 16px",
                            cursor: "pointer",
                          }}
                          data-id="3621e83a-9ec7-5e80-8bef-57eff881d861"
                        >
                          <span
                            className="text-[#a1a1a1]"
                            style={{ fontSize: "13px" }}
                            data-id="2ef51513-60a1-5a54-9b74-42a2102bf163"
                          >
                            Male
                          </span>
                        </div>
                        <div
                          style={{
                            background: "transparent",
                            border: "1px solid #2A2A3A",
                            borderRadius: "8px",
                            padding: "8px 16px",
                            cursor: "pointer",
                          }}
                          data-id="13545784-1832-522f-a24b-21827bbde9e5"
                        >
                          <span
                            className="text-[#a1a1a1]"
                            style={{ fontSize: "13px" }}
                            data-id="9a03d2a0-ab52-5034-83a4-7318575db1a0"
                          >
                            Female
                          </span>
                        </div>
                        <div
                          style={{
                            background: "transparent",
                            border: "1px solid #2A2A3A",
                            borderRadius: "8px",
                            padding: "8px 16px",
                            cursor: "pointer",
                          }}
                          data-id="9965349f-608d-5856-8a7c-a2030c4d5aa3"
                        >
                          <span
                            className="text-[#a1a1a1]"
                            style={{ fontSize: "13px" }}
                            data-id="634418e3-7629-577f-89fa-a365e40810ac"
                          >
                            Non-binary
                          </span>
                        </div>
                      </div>
                    </div>
                    <div data-id="ba7fcda9-0cca-53e2-b566-eb95570dfc24">
                      <label
                        className="block font-medium text-neutral-50 text-sm leading-5 mb-2"
                        data-id="03f5cd9b-0630-506e-adbe-3a7502c0664d"
                      >
                        Location
                      </label>
                      <div
                        style={{
                          background: "#0A0A0F",
                          border: "1px solid #2A2A3A",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          alignItems: "center",
                          minHeight: "44px",
                        }}
                        data-id="910c174e-8f1a-5ef7-804a-7efd414149a9"
                      >
                        <div
                          style={{
                            background: "rgba(74,108,247,0.15)",
                            border: "1px solid rgba(74,108,247,0.3)",
                            borderRadius: "6px",
                            padding: "4px 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                          data-id="f94f7662-99e5-5961-ac95-d8e378872816"
                        >
                          <span
                            style={{ color: "#7B9CFF", fontSize: "12px" }}
                            data-id="4991559d-a019-5a38-b2c4-fbdec94a75c8"
                          >
                            United States
                          </span>
                          <X
                            className="size-3"
                            style={{ color: "#7B9CFF", cursor: "pointer" }}
                            data-id="e910681a-b5e2-5c27-babc-2fd3698e699b"
                          />
                        </div>
                        <div
                          style={{
                            background: "rgba(74,108,247,0.15)",
                            border: "1px solid rgba(74,108,247,0.3)",
                            borderRadius: "6px",
                            padding: "4px 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                          data-id="4a95b49b-ea36-50f8-9b26-dc38b04a7b75"
                        >
                          <span
                            style={{ color: "#7B9CFF", fontSize: "12px" }}
                            data-id="9378497d-bdb7-53ef-8f02-79247688936e"
                          >
                            United Kingdom
                          </span>
                          <X
                            className="size-3"
                            style={{ color: "#7B9CFF", cursor: "pointer" }}
                            data-id="24c4d9f1-ba39-5c3f-8adc-6245424fd41a"
                          />
                        </div>
                        <div
                          style={{
                            background: "rgba(74,108,247,0.15)",
                            border: "1px solid rgba(74,108,247,0.3)",
                            borderRadius: "6px",
                            padding: "4px 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                          data-id="81db10c6-9356-55a3-87cd-72f9706293b1"
                        >
                          <span
                            style={{ color: "#7B9CFF", fontSize: "12px" }}
                            data-id="fb512e9d-b441-59a5-b526-0ac33964b5ee"
                          >
                            Canada
                          </span>
                          <X
                            className="size-3"
                            style={{ color: "#7B9CFF", cursor: "pointer" }}
                            data-id="48d41f74-ae32-567e-a068-fc3159719917"
                          />
                        </div>
                        <span
                          className="text-[#a1a1a1]"
                          style={{ fontSize: "13px", cursor: "pointer" }}
                          data-id="32ae6dbc-d567-5844-8d99-91975e812908"
                        >
                          + Add location
                        </span>
                      </div>
                    </div>
                    <div data-id="6a78db66-58a5-5707-9511-d7d9562d672d">
                      <label
                        className="block font-medium text-neutral-50 text-sm leading-5 mb-2"
                        data-id="3330436d-e3af-5891-b7c2-4f247121073d"
                      >
                        Language
                      </label>
                      <div
                        style={{ position: "relative" }}
                        data-id="1df05a32-47b5-501b-8898-94b57ccd9e05"
                      >
                        <div
                          style={{
                            background: "#0A0A0F",
                            border: "1px solid #2A2A3A",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                          }}
                          data-id="2c853589-0c21-5846-a1a3-b0917b3a5aa0"
                        >
                          <span
                            className="text-neutral-50"
                            style={{ fontSize: "14px" }}
                            data-id="f24c5ace-2534-552c-ae12-ac58f65b8690"
                          >
                            English
                          </span>
                          <ChevronDown
                            className="size-4 text-[#a1a1a1]"
                            data-id="27470874-e553-5695-92cf-347fe121e76d"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: "#16162A",
                    border: "1px solid #2A2A3A",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                  data-id="4e57f560-fc6a-5022-8068-73830ab6f336"
                >
                  <div
                    className="flex mb-4 items-center gap-2"
                    data-id="acd92981-1f44-5508-90b8-007a26ef5081"
                  >
                    <Heart
                      className="size-5"
                      style={{ color: "#6C5CE7" }}
                      data-id="a605b97c-e4b3-5f34-9ad6-164b518e10ae"
                    />
                    <h3
                      className="text-neutral-50"
                      style={{ fontSize: "16px", fontWeight: 600 }}
                      data-id="9494ecab-b4fe-5048-8f69-adb6599437f6"
                    >
                      Interests &amp; Behaviors
                    </h3>
                  </div>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5 mb-4"
                    data-id="16de9318-e567-5c22-bbde-e39ee8176bb1"
                  >
                    Select categories that match your target audience's
                    interests
                  </p>
                  <div
                    className="flex flex-wrap gap-2"
                    data-id="c6f31a13-2d8a-5b69-bf8a-081732b3d1e0"
                  >
                    <div
                      style={{
                        background: "rgba(74,108,247,0.15)",
                        border: "1px solid rgba(74,108,247,0.4)",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="212e10dd-aa33-5e7e-aa74-abc2d64338c4"
                    >
                      <DollarSign
                        className="size-3.5"
                        style={{ color: "#4A6CF7" }}
                        data-id="9771bcd9-de18-5e9e-9c95-66d8b7f2231e"
                      />
                      <span
                        style={{
                          color: "#7B9CFF",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                        data-id="6898d53f-dd9b-517c-bfce-6d1882e66bfd"
                      >
                        Finance
                      </span>
                    </div>
                    <div
                      style={{
                        background: "rgba(74,108,247,0.15)",
                        border: "1px solid rgba(74,108,247,0.4)",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="88e1af38-84b0-545d-b4d1-657c2c2b7d74"
                    >
                      <Smartphone
                        className="size-3.5"
                        style={{ color: "#4A6CF7" }}
                        data-id="c76cf4b9-0e61-545b-972f-17e722d40420"
                      />
                      <span
                        style={{
                          color: "#7B9CFF",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                        data-id="0b114735-8379-52d7-9042-70bfce8dd584"
                      >
                        Technology
                      </span>
                    </div>
                    <div
                      style={{
                        background: "rgba(74,108,247,0.15)",
                        border: "1px solid rgba(74,108,247,0.4)",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="5edaef40-d3cc-5d97-a097-8f9472cd5ef5"
                    >
                      <HeartPulse
                        className="size-3.5"
                        style={{ color: "#4A6CF7" }}
                        data-id="f4149165-8590-5023-aba4-7c6eb1731d3e"
                      />
                      <span
                        style={{
                          color: "#7B9CFF",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                        data-id="76235191-4933-5523-a401-4b4feb1b5206"
                      >
                        Health
                      </span>
                    </div>
                    <div
                      style={{
                        background: "transparent",
                        border: "1px solid #2A2A3A",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="2de7db6b-5b03-584b-95d8-d1de278b13f1"
                    >
                      <Trophy
                        className="size-3.5 text-[#a1a1a1]"
                        data-id="f7b1420c-f341-5ced-a137-3c8876350d92"
                      />
                      <span
                        className="text-[#a1a1a1]"
                        style={{ fontSize: "13px" }}
                        data-id="bb5d00c8-2e00-5bf7-b402-53141f170c21"
                      >
                        Sports
                      </span>
                    </div>
                    <div
                      style={{
                        background: "transparent",
                        border: "1px solid #2A2A3A",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="b8adafaa-7e56-5076-87bf-5999784ce817"
                    >
                      <Shirt
                        className="size-3.5 text-[#a1a1a1]"
                        data-id="54952b3f-4025-5cec-884d-4fe62538fdff"
                      />
                      <span
                        className="text-[#a1a1a1]"
                        style={{ fontSize: "13px" }}
                        data-id="032afc4a-7d70-52d2-b80a-44bcaee7da16"
                      >
                        Fashion
                      </span>
                    </div>
                    <div
                      style={{
                        background: "transparent",
                        border: "1px solid #2A2A3A",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="c527b523-59db-5a1b-a8fe-bb9357380247"
                    >
                      <Plane
                        className="size-3.5 text-[#a1a1a1]"
                        data-id="e6d5187a-03a2-5424-816d-fd8d6891d019"
                      />
                      <span
                        className="text-[#a1a1a1]"
                        style={{ fontSize: "13px" }}
                        data-id="cc717262-bc60-5bc0-8971-e60f9198e44d"
                      >
                        Travel
                      </span>
                    </div>
                    <div
                      style={{
                        background: "transparent",
                        border: "1px solid #2A2A3A",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="df9700e9-7181-54a6-ad6f-82266ff7a776"
                    >
                      <UtensilsCrossed
                        className="size-3.5 text-[#a1a1a1]"
                        data-id="19f59faf-788e-581e-91a6-cac712d95368"
                      />
                      <span
                        className="text-[#a1a1a1]"
                        style={{ fontSize: "13px" }}
                        data-id="e2b1dd11-7697-5707-855e-3ab0dad305c6"
                      >
                        Food
                      </span>
                    </div>
                    <div
                      style={{
                        background: "transparent",
                        border: "1px solid #2A2A3A",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="74a0948a-1358-5b9a-9a17-a3d847aaffd4"
                    >
                      <Music
                        className="size-3.5 text-[#a1a1a1]"
                        data-id="88dbc45b-cbc8-5e27-b8b6-dd1c25b2d50e"
                      />
                      <span
                        className="text-[#a1a1a1]"
                        style={{ fontSize: "13px" }}
                        data-id="4f937967-467f-5e0f-9746-5495fe95dfb3"
                      >
                        Music
                      </span>
                    </div>
                    <div
                      style={{
                        background: "transparent",
                        border: "1px solid #2A2A3A",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="00f841ce-5e58-5583-9013-16d786d1f1b4"
                    >
                      <Gamepad2
                        className="size-3.5 text-[#a1a1a1]"
                        data-id="37ca2795-3b4c-51a0-a4ec-d575efa04221"
                      />
                      <span
                        className="text-[#a1a1a1]"
                        style={{ fontSize: "13px" }}
                        data-id="9ba7e6b6-c811-5de4-a0f0-e195b05623a0"
                      >
                        Gaming
                      </span>
                    </div>
                    <div
                      style={{
                        background: "transparent",
                        border: "1px solid #2A2A3A",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="d0fba42c-233d-5a8f-89b2-9fc417ec74f4"
                    >
                      <GraduationCap
                        className="size-3.5 text-[#a1a1a1]"
                        data-id="dc1bc381-72b8-59f3-bdb4-7181cc2ca51a"
                      />
                      <span
                        className="text-[#a1a1a1]"
                        style={{ fontSize: "13px" }}
                        data-id="06e62a7b-74e0-5c7f-9205-c8751247899f"
                      >
                        Education
                      </span>
                    </div>
                    <div
                      style={{
                        background: "transparent",
                        border: "1px solid #2A2A3A",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="d9c2560a-960e-5a40-b839-830b40ea1a21"
                    >
                      <Briefcase
                        className="size-3.5 text-[#a1a1a1]"
                        data-id="4deed5b3-f711-5056-b5c7-f9a5dfb6f275"
                      />
                      <span
                        className="text-[#a1a1a1]"
                        style={{ fontSize: "13px" }}
                        data-id="2372a9df-49cc-505a-982e-2c6741c87a5f"
                      >
                        Business
                      </span>
                    </div>
                    <div
                      style={{
                        background: "transparent",
                        border: "1px solid #2A2A3A",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      data-id="40ab12d5-f9e6-5f35-8cc2-eda656a17c6d"
                    >
                      <Palette
                        className="size-3.5 text-[#a1a1a1]"
                        data-id="99163a00-f749-58a5-ad99-5fdb4b110152"
                      />
                      <span
                        className="text-[#a1a1a1]"
                        style={{ fontSize: "13px" }}
                        data-id="bd780ece-eb5f-5263-8bc0-deeb9a1b79ff"
                      >
                        Art &amp; Design
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: "#16162A",
                    border: "1px solid #2A2A3A",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                  data-id="511348b4-262b-59f9-b79d-f90af281ebfb"
                >
                  <div
                    className="flex mb-4 items-center gap-2"
                    data-id="ae8b6d54-7548-5408-8908-00ecadc0e38c"
                  >
                    <Activity
                      className="size-5"
                      style={{ color: "#4A6CF7" }}
                      data-id="7698d276-aa7c-55a0-966e-e779f773f2f3"
                    />
                    <h3
                      className="text-neutral-50"
                      style={{ fontSize: "16px", fontWeight: 600 }}
                      data-id="ec3fccdc-c5ec-5e22-96d4-64b484716759"
                    >
                      Usage &amp; Account
                    </h3>
                  </div>
                  <div
                    className="flex flex-col gap-4"
                    data-id="55c5cf77-1e7b-5cd2-8065-b37acc31c633"
                  >
                    <div data-id="9546ed4d-6c85-5cb8-b092-93e599ce9e97">
                      <label
                        className="block font-medium text-neutral-50 text-sm leading-5 mb-2"
                        data-id="cd029aae-ef1d-5dc1-bae1-0783b8b6dc2b"
                      >
                        User Activity Level
                      </label>
                      <div
                        className="flex items-center gap-2"
                        data-id="af7f0022-8a11-5468-89d4-421de840ed07"
                      >
                        <div
                          style={{
                            background: "transparent",
                            border: "1px solid #2A2A3A",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            cursor: "pointer",
                            flex: 1,
                            textAlign: "center",
                          }}
                          data-id="665e4553-c124-5b14-8df2-54452f71571f"
                        >
                          <span
                            className="text-[#a1a1a1]"
                            style={{ fontSize: "13px" }}
                            data-id="8382d522-07b6-5305-852f-5c7c6efbf56b"
                          >
                            Casual
                          </span>
                          <p
                            className="text-[#a1a1a1]"
                            style={{ fontSize: "10px", marginTop: "2px" }}
                            data-id="4f8877ab-c5b7-588c-b6c8-1cc2edc9c779"
                          >
                            1-2x / week
                          </p>
                        </div>
                        <div
                          style={{
                            background: "rgba(74,108,247,0.15)",
                            border: "1px solid rgba(74,108,247,0.4)",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            cursor: "pointer",
                            flex: 1,
                            textAlign: "center",
                          }}
                          data-id="6433371a-fe3b-5df9-987b-463745b3ccce"
                        >
                          <span
                            style={{
                              color: "#7B9CFF",
                              fontSize: "13px",
                              fontWeight: 500,
                            }}
                            data-id="5b793479-8885-5929-a8e7-783806358b76"
                          >
                            Regular
                          </span>
                          <p
                            style={{
                              color: "rgba(123,156,255,0.7)",
                              fontSize: "10px",
                              marginTop: "2px",
                            }}
                            data-id="a3697e88-387c-54bf-ae25-da9049025fb0"
                          >
                            Daily
                          </p>
                        </div>
                        <div
                          style={{
                            background: "transparent",
                            border: "1px solid #2A2A3A",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            cursor: "pointer",
                            flex: 1,
                            textAlign: "center",
                          }}
                          data-id="e7d25597-ffac-5c08-b02c-28708f6fa89e"
                        >
                          <span
                            className="text-[#a1a1a1]"
                            style={{ fontSize: "13px" }}
                            data-id="ce83db2f-7590-5fe4-86ca-5bc3509d6ad0"
                          >
                            Power User
                          </span>
                          <p
                            className="text-[#a1a1a1]"
                            style={{ fontSize: "10px", marginTop: "2px" }}
                            data-id="ea267265-07d1-57e1-9233-8d0db3c644b4"
                          >
                            Multiple / day
                          </p>
                        </div>
                      </div>
                    </div>
                    <div data-id="30a2a44a-c4a0-5270-9d89-ded5f5c862ce">
                      <label
                        className="block font-medium text-neutral-50 text-sm leading-5 mb-2"
                        data-id="f107cd87-3cc4-5703-a67a-05683a01d1f0"
                      >
                        Account Type
                      </label>
                      <div
                        className="flex items-center gap-2"
                        data-id="9a3acfcb-742c-52ee-bea8-1e439251147f"
                      >
                        <div
                          style={{
                            background: "rgba(74,108,247,0.15)",
                            border: "1px solid rgba(74,108,247,0.4)",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            cursor: "pointer",
                            flex: 1,
                            textAlign: "center",
                          }}
                          data-id="e48db2e7-40db-514f-940b-24456c60eaa0"
                        >
                          <span
                            style={{
                              color: "#7B9CFF",
                              fontSize: "13px",
                              fontWeight: 500,
                            }}
                            data-id="d455fb1d-3f30-5f5f-a712-b47fa2739a9a"
                          >
                            Free / Freemium
                          </span>
                        </div>
                        <div
                          style={{
                            background: "transparent",
                            border: "1px solid #2A2A3A",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            cursor: "pointer",
                            flex: 1,
                            textAlign: "center",
                          }}
                          data-id="c0eb11c4-087d-55c1-ae7c-47038f369096"
                        >
                          <span
                            className="text-[#a1a1a1]"
                            style={{ fontSize: "13px" }}
                            data-id="d921e8d6-2aaa-5c9c-9fc1-8839b5eaa8e7"
                          >
                            Premium / Paid
                          </span>
                        </div>
                        <div
                          style={{
                            background: "transparent",
                            border: "1px solid #2A2A3A",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            cursor: "pointer",
                            flex: 1,
                            textAlign: "center",
                          }}
                          data-id="442d0769-7369-5e3c-ba66-cff91cacdb98"
                        >
                          <span
                            className="text-[#a1a1a1]"
                            style={{ fontSize: "13px" }}
                            data-id="59c1ce31-c986-55e8-8083-e217838135fb"
                          >
                            Enterprise
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                alignItems: "flex-start",
                display: "flex",
                flex: "0 0 45%",
                flexDirection: "column",
                paddingTop: "8px",
              }}
              data-id="9494c0be-32fa-5d40-b02c-a01b2cd50279"
            >
              <div
                style={{ width: "100%", position: "sticky", top: "0" }}
                data-id="4e458dd3-e9a9-5c40-a981-f8060cc26857"
              >
                <div
                  style={{
                    background: "#16162A",
                    border: "1px solid #2A2A3A",
                    borderRadius: "16px",
                    padding: "24px",
                    width: "100%",
                  }}
                  data-id="eea87c1d-13fc-559a-8be9-9239ae6d5bef"
                >
                  <div
                    className="flex mb-6 items-center gap-2"
                    data-id="112459e8-1c54-5984-862d-b17abc1012ef"
                  >
                    <BarChart3
                      className="size-5"
                      style={{ color: "#4A6CF7" }}
                      data-id="1e19e338-ce3f-5aa0-ba6a-2b22cab7725a"
                    />
                    <h3
                      className="text-neutral-50"
                      style={{ fontSize: "18px", fontWeight: 600 }}
                      data-id="a333c522-6899-5ccc-8dbf-b46a200224fe"
                    >
                      Audience Summary
                    </h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "24px",
                    }}
                    data-id="52e1472b-1d7e-5910-ac58-38bc67185cb0"
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "200px",
                        height: "200px",
                      }}
                      data-id="f63960c6-9421-5e8a-bf65-ffaee4c4eccc"
                    >
                      <svg
                        viewBox="0 0 200 200"
                        style={{ width: "200px", height: "200px" }}
                        data-id="05440067-6776-5e0a-9aaa-cdd00ab5b0bf"
                      >
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#2A2A3A"
                          strokeWidth="20"
                          data-id="2a25941b-047b-5e55-b2f3-c58d3d3df45a"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#4A6CF7"
                          strokeWidth="20"
                          strokeDasharray="502.65"
                          strokeDashoffset="150.8"
                          strokeLinecap="round"
                          style={{
                            transform: "rotate(-90deg)",
                            transformOrigin: "center",
                          }}
                          data-id="c7fc635f-e540-5be4-a146-e4bcd63c57b6"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#6C5CE7"
                          strokeWidth="20"
                          strokeDasharray="502.65"
                          strokeDashoffset="377"
                          strokeLinecap="round"
                          style={{
                            transform: "rotate(162deg)",
                            transformOrigin: "center",
                          }}
                          data-id="a55280e1-4365-5f96-8844-d04a9452bbfe"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#4ADE80"
                          strokeWidth="20"
                          strokeDasharray="502.65"
                          strokeDashoffset="427"
                          strokeLinecap="round"
                          style={{
                            transform: "rotate(212deg)",
                            transformOrigin: "center",
                          }}
                          data-id="3c45a522-8814-5723-b3d1-731f05f51541"
                        />
                      </svg>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                          textAlign: "center",
                        }}
                        data-id="eef6bf43-bc58-5f4d-b776-634f568fb6ae"
                      >
                        <p
                          className="text-neutral-50"
                          style={{
                            fontSize: "28px",
                            fontWeight: 700,
                            lineHeight: "1",
                          }}
                          data-id="68cdf724-a6b0-5598-9baa-ae6d806293d0"
                        >
                          2.4M
                        </p>
                        <p
                          className="text-[#a1a1a1]"
                          style={{ fontSize: "11px", marginTop: "4px" }}
                          data-id="70f54b02-0a83-595f-a49b-bcb5192dc2af"
                        >
                          Est. Reach
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex flex-col gap-3"
                    style={{ marginBottom: "20px" }}
                    data-id="b21123c7-1423-5c0a-ae5d-de47f982ffab"
                  >
                    <div
                      className="flex justify-between items-center"
                      data-id="f81064f8-b9e9-56d9-aef4-e2b6505fba1d"
                    >
                      <div
                        className="flex items-center gap-2"
                        data-id="c39ffb62-26c1-5f43-a0a7-4733b1ac8ff4"
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#4A6CF7",
                          }}
                          data-id="5fe71aab-e835-5d40-963e-3e5212818a7f"
                        />
                        <span
                          className="text-[#a1a1a1] text-sm leading-5"
                          data-id="03c3d6eb-c78a-594b-b2db-03351252c46d"
                        >
                          18-24 years
                        </span>
                      </div>
                      <span
                        className="text-neutral-50 text-sm leading-5"
                        style={{ fontWeight: 500 }}
                        data-id="3ddf7563-397b-5e3e-9803-ed3cca6601f6"
                      >
                        42%
                      </span>
                    </div>
                    <div
                      className="flex justify-between items-center"
                      data-id="8abcfde0-836e-59dd-a8db-11c513abff43"
                    >
                      <div
                        className="flex items-center gap-2"
                        data-id="26756874-59a8-5fc1-af23-1c9d7017afea"
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#6C5CE7",
                          }}
                          data-id="9df6ce1e-6205-53c5-96a3-9317e02c793a"
                        />
                        <span
                          className="text-[#a1a1a1] text-sm leading-5"
                          data-id="66346b8b-b9ed-592a-bfe6-2bedc502901d"
                        >
                          25-30 years
                        </span>
                      </div>
                      <span
                        className="text-neutral-50 text-sm leading-5"
                        style={{ fontWeight: 500 }}
                        data-id="6d34c114-23dd-5c64-8f45-802eec3b9adf"
                      >
                        35%
                      </span>
                    </div>
                    <div
                      className="flex justify-between items-center"
                      data-id="ebb95cec-1dcc-5fb7-8fdd-9c369e1c5918"
                    >
                      <div
                        className="flex items-center gap-2"
                        data-id="e4704deb-6145-5678-8bc5-4a91732b0dbc"
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#4ADE80",
                          }}
                          data-id="ae579c14-5d0d-509e-a8ae-31b7453e34f7"
                        />
                        <span
                          className="text-[#a1a1a1] text-sm leading-5"
                          data-id="22999f0c-597f-5629-8c0a-3969dfb9d21d"
                        >
                          31-35 years
                        </span>
                      </div>
                      <span
                        className="text-neutral-50 text-sm leading-5"
                        style={{ fontWeight: 500 }}
                        data-id="c8cf7bf8-584f-581f-9d36-e546f381b406"
                      >
                        23%
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid #2A2A3A",
                      paddingTop: "16px",
                      marginBottom: "16px",
                    }}
                    data-id="fbdcf090-3173-55d0-875f-c04b3d46883e"
                  >
                    <p
                      className="text-neutral-50"
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom: "10px",
                      }}
                      data-id="da10e38c-b407-53a3-84f2-2be579d0a046"
                    >
                      Selected Filters
                    </p>
                    <div
                      className="flex flex-wrap gap-2"
                      data-id="aded0899-c51e-590c-8ed4-70e3e3b1420e"
                    >
                      <div
                        style={{
                          background: "rgba(74,108,247,0.1)",
                          border: "1px solid rgba(74,108,247,0.25)",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                        data-id="23c08b7b-1332-583d-890f-993d5899efb1"
                      >
                        <span
                          style={{ color: "#7B9CFF", fontSize: "11px" }}
                          data-id="f919e66f-483d-521f-a769-a2adfed479d5"
                        >
                          Age: 18-35
                        </span>
                        <X
                          className="size-3"
                          style={{
                            color: "rgba(123,156,255,0.6)",
                            cursor: "pointer",
                          }}
                          data-id="08f2714a-030d-5db1-8c6f-16b3d55ced85"
                        />
                      </div>
                      <div
                        style={{
                          background: "rgba(74,108,247,0.1)",
                          border: "1px solid rgba(74,108,247,0.25)",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                        data-id="d86447d7-7aff-5031-80af-6b4df2792da2"
                      >
                        <span
                          style={{ color: "#7B9CFF", fontSize: "11px" }}
                          data-id="b40e90a3-a28d-5559-a579-9eef239ef74f"
                        >
                          Gender: All
                        </span>
                        <X
                          className="size-3"
                          style={{
                            color: "rgba(123,156,255,0.6)",
                            cursor: "pointer",
                          }}
                          data-id="73363fd7-b426-51e2-9b8a-365606333862"
                        />
                      </div>
                      <div
                        style={{
                          background: "rgba(74,108,247,0.1)",
                          border: "1px solid rgba(74,108,247,0.25)",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                        data-id="9b4d90ff-0b18-5ca2-8340-d10b24575eca"
                      >
                        <span
                          style={{ color: "#7B9CFF", fontSize: "11px" }}
                          data-id="376377fc-eb20-5cc2-b8d1-d30aef285027"
                        >
                          US, UK, CA
                        </span>
                        <X
                          className="size-3"
                          style={{
                            color: "rgba(123,156,255,0.6)",
                            cursor: "pointer",
                          }}
                          data-id="5e2f0540-dfbe-5036-aff4-cd366e10be9c"
                        />
                      </div>
                      <div
                        style={{
                          background: "rgba(74,108,247,0.1)",
                          border: "1px solid rgba(74,108,247,0.25)",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                        data-id="27a57145-7a66-59b2-b06e-91227648442e"
                      >
                        <span
                          style={{ color: "#7B9CFF", fontSize: "11px" }}
                          data-id="05dfaf9a-a104-5522-9380-227f3c1a67ed"
                        >
                          Finance
                        </span>
                        <X
                          className="size-3"
                          style={{
                            color: "rgba(123,156,255,0.6)",
                            cursor: "pointer",
                          }}
                          data-id="c6ec5b3a-d309-5f73-aa8c-7511f2b45027"
                        />
                      </div>
                      <div
                        style={{
                          background: "rgba(74,108,247,0.1)",
                          border: "1px solid rgba(74,108,247,0.25)",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                        data-id="fc64e603-d6b1-569d-b34c-aac09815cf01"
                      >
                        <span
                          style={{ color: "#7B9CFF", fontSize: "11px" }}
                          data-id="369b3a70-dee7-53f7-b907-0a03c3fd48a2"
                        >
                          Technology
                        </span>
                        <X
                          className="size-3"
                          style={{
                            color: "rgba(123,156,255,0.6)",
                            cursor: "pointer",
                          }}
                          data-id="5728cdbc-cece-5139-9b33-47e72faec14e"
                        />
                      </div>
                      <div
                        style={{
                          background: "rgba(74,108,247,0.1)",
                          border: "1px solid rgba(74,108,247,0.25)",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                        data-id="1523a280-20c8-5f86-aa20-f783ff61d700"
                      >
                        <span
                          style={{ color: "#7B9CFF", fontSize: "11px" }}
                          data-id="c8f4b912-a4d1-5d55-861b-22d609b3e57c"
                        >
                          Health
                        </span>
                        <X
                          className="size-3"
                          style={{
                            color: "rgba(123,156,255,0.6)",
                            cursor: "pointer",
                          }}
                          data-id="c59e530c-e36e-5c89-8a41-5592f0cba59d"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#0A0A0F",
                      border: "1px solid #2A2A3A",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                    data-id="6e8fddb9-2768-5d46-b466-7c52630a6a7e"
                  >
                    <div
                      style={{
                        height: "48px",
                        position: "relative",
                        width: "48px",
                      }}
                      data-id="4ef55c96-d658-5d8a-a172-c12ab396558c"
                    >
                      <svg
                        viewBox="0 0 48 48"
                        style={{
                          height: "48px",
                          transform: "rotate(-90deg)",
                          width: "48px",
                        }}
                        data-id="e9712ee7-24c4-53a3-9cb9-dbd04046664e"
                      >
                        <circle
                          cx="24"
                          cy="24"
                          r="19"
                          fill="none"
                          stroke="#2A2A3A"
                          strokeWidth="4"
                          data-id="7957e2da-5332-5ce0-b7d8-200c3c843aef"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="19"
                          fill="none"
                          stroke="#4ADE80"
                          strokeWidth="4"
                          strokeDasharray="119.38"
                          strokeDashoffset="23.88"
                          strokeLinecap="round"
                          data-id="49bbb689-27a9-50e2-aadf-52e3ccb5968f"
                        />
                      </svg>
                      <span
                        style={{
                          color: "#4ADE80",
                          fontSize: "11px",
                          fontWeight: 700,
                          left: "50%",
                          position: "absolute",
                          top: "50%",
                          transform: "translate(-50%,-50%)",
                        }}
                        data-id="e782bf8c-9043-51d9-8b2d-40d5dcbb520f"
                      >
                        80%
                      </span>
                    </div>
                    <div data-id="04567fda-9a27-5771-851d-4536a9672f64">
                      <p
                        className="text-neutral-50"
                        style={{ fontSize: "13px", fontWeight: 600 }}
                        data-id="22cbd668-e757-545a-b7a0-9bfe8ccbf555"
                      >
                        Audience Quality
                      </p>
                      <p
                        style={{
                          color: "#4ADE80",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                        data-id="48abac3f-2eae-5e47-8bac-a5cfe0101657"
                      >
                        Very Good
                      </p>
                      <p
                        className="text-[#a1a1a1]"
                        style={{ fontSize: "11px", marginTop: "2px" }}
                        data-id="a3abebef-f08c-517f-b8d2-5ab632393408"
                      >
                        Add more interests for better targeting
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: "#16162A",
                    border: "1px solid #2A2A3A",
                    borderRadius: "12px",
                    padding: "16px",
                    marginTop: "16px",
                    width: "100%",
                  }}
                  data-id="1241a336-153d-5ddf-ae02-48efd4a8f30b"
                >
                  <div
                    className="flex mb-3 items-center gap-2"
                    data-id="64e60c4b-343d-530b-aa79-00fee05a8f50"
                  >
                    <Sparkles
                      className="size-4"
                      style={{ color: "#FBBF24" }}
                      data-id="5a84bae1-695e-5583-86f5-1d5a8c5e4561"
                    />
                    <span
                      className="text-neutral-50"
                      style={{ fontSize: "13px", fontWeight: 600 }}
                      data-id="ea1c0328-2d7c-5f3f-90b4-56fb2a80e5ab"
                    >
                      AI Insight
                    </span>
                  </div>
                  <p
                    className="text-[#a1a1a1]"
                    style={{ fontSize: "12px", lineHeight: "1.6" }}
                    data-id="93bcb276-f32c-5dc9-a4d5-a96e8adfc472"
                  >
                    Based on your selections, your target audience aligns well
                    with the FinTrack product. Millennials and Gen Z in
                    English-speaking markets show high adoption rates for
                    personal finance apps. Regular daily users with freemium
                    accounts represent a strong growth segment for conversion.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              alignItems: "center",
              background: "oklch(0.145 0 0)",
              borderTop: "1px solid #2A2A3A",
              bottom: 0,
              display: "flex",
              height: "72px",
              justifyContent: "space-between",
              left: "272px",
              padding: "0 32px",
              position: "fixed",
              right: 0,
              zIndex: 20,
            }}
            data-id="7a5e8d51-1f96-5f91-811f-5ce3d7b2df84"
          >
            <span
              className="text-[#a1a1a1] text-sm leading-5"
              data-id="aca342ee-02d1-5c2f-a288-3bff7e50476a"
            >
              Step 2 of 11
            </span>
            <div
              style={{ alignItems: "center", display: "flex", gap: "16px" }}
              data-id="478ccb14-6a51-51c1-8c73-ab19e4f91412"
            >
              <button
                style={{
                  alignItems: "center",
                  background: "transparent",
                  border: "1px solid #2A2A3A",
                  borderRadius: "10px",
                  color: "oklch(0.708 0 0)",
                  cursor: "pointer",
                  display: "flex",
                  fontSize: "14px",
                  fontWeight: 500,
                  gap: "8px",
                  padding: "10px 24px",
                }}
                data-id="030facf6-fd5c-52a6-a766-b2cbb061ce6c"
              >
                <ArrowLeft
                  className="size-4"
                  data-id="67dd2bef-438e-562d-b8c7-50328b3c8724"
                />
                <span data-id="98ded91c-9143-5c64-920e-bfa2369fdde4">Back</span>
              </button>
              <button
                style={{
                  alignItems: "center",
                  background: "linear-gradient(135deg,#4A6CF7,#6C5CE7)",
                  border: "none",
                  borderRadius: "10px",
                  boxShadow: "0 0 20px rgba(74,108,247,0.3)",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  fontSize: "14px",
                  fontWeight: 600,
                  gap: "8px",
                  padding: "10px 28px",
                }}
                data-id="99560ffa-db25-5e39-b955-449ea953d963"
              >
                <span data-id="dba6a6d0-e179-59a7-847d-44e0bec1d2bf">
                  Continue to Step 3
                </span>
                <ArrowRight
                  className="size-4"
                  data-id="e67427fe-8af6-5f90-9f86-38156cc72375"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
