import { useQuery } from "@tanstack/react-query";
import supabase from "../../../config/supabase";
import {
  Box,
  CardMedia,
  Chip,
  IconButton,
  Rating,
  Stack,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import ProductListingToolbar from "../components/ProductListingToolbar";
import Loading from "../../common/components/Loading";
import DeleteAction from "../components/DeleteAction";

export default function ProductListing() {
  const {
    isLoading,
    data: products,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      supabase
        .from("product")
        .select(
          `id, title, thumbnail, price, stock, rating, category (name), brand (name)`
        ),
    select: (res) => {
      return res.data.map((item) => ({
        ...item,
        category: item.category.name,
        brand: item.brand.name,
      }));
    },
  });

  if (isLoading) return <Loading />;

  const gridData = {
    columns: [
      {
        field: "id",
        headerName: "ID",
      },
      {
        field: "title",
        headerName: "Title",
        width: 350,
        renderCell: (params) => {
          const thumbnail = params.row.thumbnail;
          const title = params.value;
          return (
            <Stack direction="row" alignItems="center" gap={2}>
              <Box width={70} height={50}>
                <CardMedia
                  component="img"
                  height={50}
                  width={50}
                  image={thumbnail}
                  alt={title}
                  sx={{
                    objectFit: "cover",
                  }}
                />
              </Box>

              <Box>{title}</Box>
            </Stack>
          );
        },
      },
      {
        field: "stock",
        headerName: "Stock",
      },
      {
        field: "price",
        headerName: "Price ($)",
      },
      {
        field: "category",
        headerName: "Category",
        renderCell: (params) => {
          const categoryColors = {
            laptops: "primary",
            smartphones: "success",
            pc: "secondary",
            tablets: "error",
          };

          return (
            <Chip
              variant="outlined"
              color={categoryColors[params.value]}
              size="small"
              label={params.value}
            />
          );
        },
        width: 150,
      },
      {
        field: "brand",
        headerName: "Brand",
        renderCell: (params) => {
          const brandColors = {
            apple: "primary",
            samsung: "success",
            lg: "secondary",
            nokia: "error",
          };

          return (
            <Chip
              variant="contained"
              color={brandColors[params.value]}
              size="small"
              label={params.value}
            />
          );
        },
      },
      {
        field: "rating",
        headerName: "Rating",
        renderCell: (params) => {
          return (
            <Rating
              name={params.field}
              value={params.value}
              readOnly
              precision={0.5}
            />
          );
        },
        width: 200,
      },
      {
        field: "action",
        headerName: "Action",
        renderCell: (params) => {
          return (
            <Stack direction="row" alignItems="center">
              <Tooltip title="View Detail" placement="top">
                <IconButton
                  aria-label="View Detail"
                  to={`/products/${params.id}`}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit" placement="top">
                <IconButton aria-label="Edit">
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <DeleteAction id={params.id} />
            </Stack>
          );
        },
        width: 150,
      },
    ],
    rows: products,
  };

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        {...gridData}
        slots={{
          toolbar: ProductListingToolbar,
        }}
      />
    </Box>
  );
}
