import { useState, useEffect } from "react";
import "./App.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
interface Campaign {
  information: {
    name: string;
    describe: string;
  };
  subCampaigns: SubCampaign[];
}

interface SubCampaign {
  name: string;
  status: boolean;
  ads: Ad[];
}

interface Ad {
  name: string;
  quantity: number;
}

function sliceText(name: string) {
  if (name.length > 30) {
    return name.substring(0, 30) + "...";
  }
  return name;
}

function App() {
  const campaign: Campaign = {
    information: {
      name: "",
      describe: "",
    },
    subCampaigns: [
      {
        name: "Chiến dịch con 1",
        status: true,
        ads: [
          {
            name: "Quảng cáo 1",
            quantity: 0,
          },
        ],
      },
    ],
  };
  const [value, setValue] = useState("1");
  const [dataCampaign, setDataCampaign] = useState<Campaign>(campaign);
  const [validateOnSubmit, setValidateOnSubmit] = useState<boolean>(false);
  const [activeidxSubCampaign, setActiveidxSubCampaign] = useState(0);
  const [selectedAds, setSelectedAds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    // Kiểm tra nếu tất cả các ads đã được chọn thì setSelectAll(true)
    const allAdsIndexes = dataCampaign.subCampaigns.flatMap((subCampaign) => {
      return subCampaign.ads.map((ad, adIndex) => adIndex);
    });
    if (selectedAds.length === allAdsIndexes.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedAds, dataCampaign]);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleCheckboxChange = (adIndex: number) => {
    setSelectedAds((prevSelectedAds) => {
      const index = prevSelectedAds.indexOf(adIndex);
      if (index === -1) {
        return [...prevSelectedAds, adIndex];
      } else {
        return prevSelectedAds.filter((index) => index !== adIndex);
      }
    });
  };

  const handleSelectAll = () => {
    setSelectAll(true);
    const allAdsIndexes = dataCampaign.subCampaigns[
      activeidxSubCampaign
    ].ads.map((_, index) => index);
    setSelectedAds(allAdsIndexes);
  };

  const handleDeselectAll = () => {
    setSelectAll(false);
    setSelectedAds([]);
  };

  const totalQuantity = (index: number) => {
    return dataCampaign.subCampaigns[index].ads.reduce((acc, ad) => {
      return acc + ad.quantity;
    }, 0);
  };

  const handleChangeInfomation =
    (fieldName: keyof Campaign["information"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setDataCampaign((prevData) => ({
        ...prevData,
        information: {
          ...prevData.information,
          [fieldName]: newValue,
        },
      }));
    };

  const handleSubCampaignNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSubCampaigns = [...dataCampaign.subCampaigns];
    newSubCampaigns[activeidxSubCampaign].name = e.target.value;
    setDataCampaign((prevData) => ({
      ...prevData,
      subCampaigns: newSubCampaigns,
    }));
  };

  const handleAddSubCampaign = () => {
    const newSubCampaigns1 = [...dataCampaign.subCampaigns];
    setActiveidxSubCampaign(newSubCampaigns1.length);
    const newSubCampaign: SubCampaign = {
      name: `Chiến dịch con ${newSubCampaigns1.length + 1}`,
      status: true,
      ads: [{ name: "Quảng cáo 1", quantity: 0 }],
    };
    handleDeselectAll();
    setDataCampaign((prevData) => ({
      ...prevData,
      subCampaigns: [...prevData.subCampaigns, newSubCampaign],
    }));
  };

  const handleAdsChange =
    (adIndex: number, fieldName: keyof SubCampaign["ads"][number]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue =
        fieldName === "quantity"
          ? parseFloat(e?.target?.value || "0")
          : e.target.value;
      setDataCampaign((prevData) => {
        const newSubCampaigns = [...prevData.subCampaigns];
        const newAds = [...newSubCampaigns[activeidxSubCampaign].ads];
        newAds[adIndex] = {
          ...newAds[adIndex],
          [fieldName]: newValue,
        };
        newSubCampaigns[activeidxSubCampaign] = {
          ...newSubCampaigns[activeidxSubCampaign],
          ads: newAds,
        };
        return {
          ...prevData,
          subCampaigns: newSubCampaigns,
        };
      });
    };

  const handleAddAds = () => {
    setDataCampaign((prevData) => {
      const newSubCampaigns = [...prevData.subCampaigns];
      const newAd = {
        name: `Quảng cáo ${
          newSubCampaigns[activeidxSubCampaign].ads.length + 1
        }`,
        quantity: 0,
      };
      const newAds = [...newSubCampaigns[activeidxSubCampaign].ads, newAd];
      newSubCampaigns[activeidxSubCampaign] = {
        ...newSubCampaigns[activeidxSubCampaign],
        ads: newAds,
      };
      return {
        ...prevData,
        subCampaigns: newSubCampaigns,
      };
    });
  };

  const handleSubmit = () => {
    setValidateOnSubmit(true);
    const isSubCampaignNameValid = dataCampaign.subCampaigns.every(
      (subCampaign) => subCampaign.name.trim() !== ""
    );
    const isAdsNameValid = dataCampaign.subCampaigns.every((subCampaign) =>
      subCampaign.ads.every((ad) => ad.name.trim() !== "")
    );
    const isAdsQuantityValid = dataCampaign.subCampaigns.every((subCampaign) =>
      subCampaign.ads.every((ad) => ad.quantity > 0)
    );
    if (
      !dataCampaign.information.name ||
      !isSubCampaignNameValid ||
      !isAdsNameValid ||
      !isAdsQuantityValid
    ) {
      alert("Vui lòng điền đúng và đầy đủ thông tin");
    } else {
      alert(
        `Thêm thành công chiến dịch ${JSON.stringify({
          campaign: dataCampaign,
        })}`
      );
    }
  };

  const validateSubCampaign = (subCampaign: SubCampaign) => {
    const isAdsNameValid = subCampaign.ads.every((ad) => ad.name.trim() !== "");
    const isAdsQuantityValid = subCampaign.ads.every((ad) => ad.quantity > 0);
    if (!subCampaign.name || !isAdsNameValid || !isAdsQuantityValid) {
      return true;
    } else {
      return false;
    }
  };

  const deleteAdsByIndexes = (adIndexes: number[]) => {
    setDataCampaign((prevData) => {
      const newSubCampaigns = [...prevData.subCampaigns];
      const newAds = [...newSubCampaigns[activeidxSubCampaign].ads];
      adIndexes.sort((a, b) => b - a);

      adIndexes.forEach((adIndex) => {
        newAds.splice(adIndex, 1);
      });

      newSubCampaigns[activeidxSubCampaign] = {
        ...newSubCampaigns[activeidxSubCampaign],
        ads: newAds,
      };

      return {
        ...prevData,
        subCampaigns: newSubCampaigns,
      };
    });
  };

  return (
    <Grid container>
      <Grid item xs={12} padding={2}>
        <Box textAlign="right">
          <Button variant="contained" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid item xs={12} padding={2}>
        <Paper elevation={1}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChangeTab}>
                <Tab label="Thông tin" value="1" />
                <Tab label="Chiến dịch con" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Tên chiến dịch"
                    variant="standard"
                    value={dataCampaign.information.name}
                    onChange={handleChangeInfomation("name")}
                    error={validateOnSubmit && !dataCampaign.information.name}
                    helperText={
                      validateOnSubmit &&
                      !dataCampaign.information.name &&
                      "Dữ liệu không hợp lệ"
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="standard-required"
                    label="Mô tả"
                    value={dataCampaign.information.describe}
                    variant="standard"
                    onChange={handleChangeInfomation("describe")}
                  />
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="2">
              <Grid container>
                <Grid
                  item
                  xs={12}
                  style={{ overflow: "auto", padding: "5px 10px" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      padding: "5px 0",
                    }}
                    gap={2}
                  >
                    <IconButton
                      onClick={() => handleAddSubCampaign()}
                      color="secondary"
                      size="large"
                      style={{ background: "rgb(237, 237, 237)" }}
                    >
                      <AddIcon />
                    </IconButton>
                    {dataCampaign.subCampaigns?.map(
                      (item: SubCampaign, index) => (
                        <Paper
                          elevation={1}
                          key={index}
                          onClick={() => {
                            setActiveidxSubCampaign(index);
                            handleDeselectAll();
                          }}
                          sx={{
                            cursor: "pointer",
                            border: "2px solid #fff",
                            boxShadow: "none",
                            ...(index === activeidxSubCampaign
                              ? { border: "2px solid rgb(33, 150, 243)" }
                              : {}),
                          }}
                        >
                          <Card sx={{ width: 214, height: 124 }}>
                            <CardHeader
                              sx={{ padding: "8px 8px 4px" }}
                              title={
                                <Typography
                                  align="center"
                                  variant="h6"
                                  title={item.name}
                                  sx={{
                                    wordBreak: "break-word",
                                    color:
                                      validateOnSubmit &&
                                      validateSubCampaign(item)
                                        ? "red"
                                        : "black",
                                  }}
                                >
                                  {sliceText(item.name)}
                                  <CheckCircleRoundedIcon
                                    sx={{
                                      width: 15,
                                      verticalAlign: "-4px",
                                    }}
                                    color={item.status ? "success" : "disabled"}
                                  />
                                </Typography>
                              }
                            />
                            <CardContent sx={{ padding: "0px 8px" }}>
                              <Typography variant="h5" align="center">
                                {totalQuantity(index)}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Paper>
                      )
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} marginTop={2}>
                  <Grid container alignItems="center">
                    <Grid item xs={8}>
                      <TextField
                        key={activeidxSubCampaign}
                        fullWidth
                        required
                        id="standard-required"
                        label="Tên chiến dịch con"
                        defaultValue={
                          dataCampaign.subCampaigns[activeidxSubCampaign].name
                        }
                        error={
                          validateOnSubmit &&
                          !dataCampaign.subCampaigns[activeidxSubCampaign].name
                        }
                        helperText={
                          validateOnSubmit &&
                          !dataCampaign.subCampaigns[activeidxSubCampaign]
                            .name &&
                          "Dữ liệu không hợp lệ"
                        }
                        onChange={handleSubCampaignNameChange}
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={4} textAlign="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            key={activeidxSubCampaign}
                            onChange={(e) => {
                              const newSubCampaigns = [
                                ...dataCampaign.subCampaigns,
                              ];
                              newSubCampaigns[activeidxSubCampaign].status =
                                e.target.checked;
                              setDataCampaign((prevData) => ({
                                ...prevData,
                                subCampaigns: newSubCampaigns,
                              }));
                            }}
                            checked={
                              dataCampaign.subCampaigns[activeidxSubCampaign]
                                .status
                            }
                          />
                        }
                        label="Đang hoạt động"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} marginTop={4}>
                <Typography variant="h6">DANH SÁCH QUẢNG CÁO</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width={20}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectAll}
                              indeterminate={
                                !selectAll && selectedAds.length > 0
                              }
                              onChange={
                                selectAll ? handleDeselectAll : handleSelectAll
                              }
                            />
                          }
                          label=""
                        />
                      </TableCell>
                      {selectedAds.length > 0 ? (
                        <>
                          <TableCell>
                            <Tooltip title="Xóa">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  deleteAdsByIndexes(selectedAds);
                                  setSelectedAds([]);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          <TableCell />
                        </>
                      ) : (
                        <>
                          <TableCell>
                            <Typography paragraph margin={0}>
                              Tên quảng cáo *
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography paragraph margin={0}>
                              Số lượng *
                            </Typography>
                          </TableCell>
                        </>
                      )}
                      <TableCell width={100} align="right">
                        <Button variant="outlined" onClick={handleAddAds}>
                          <AddIcon fontSize="small" sx={{ marginRight: 1 }} />{" "}
                          Thêm
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody key={activeidxSubCampaign}>
                    {dataCampaign.subCampaigns[activeidxSubCampaign].ads?.map(
                      (item: Ad, index: number) => (
                        <TableRow
                          key={index}
                          hover
                          selected={selectedAds.includes(index)}
                        >
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedAds.includes(index)}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                              }
                              label=""
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.name}
                              onChange={handleAdsChange(index, "name")}
                              error={validateOnSubmit && !item.name}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              onChange={handleAdsChange(index, "quantity")}
                              type="number"
                              error={validateOnSubmit && item.quantity < 1}
                              value={item.quantity}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Xóa">
                              <IconButton
                                size="small"
                                onClick={() => deleteAdsByIndexes([index])}
                                disabled={selectedAds.length > 0}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </Grid>
            </TabPanel>
          </TabContext>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
