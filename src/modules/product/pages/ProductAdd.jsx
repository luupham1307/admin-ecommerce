import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import Loading from "../../common/components/Loading";
import { Controller, useForm } from "react-hook-form";
import RHFSelect from "../../common/components/RHFSelect";
import supabase from "../../../config/supabase";

import { generateFilePath } from "../helpers/file";
import { yupResolver } from "@hookform/resolvers/yup";
import { NumericFormat } from "react-number-format";
import FormErrorMessage from "../../common/components/FormErrorMessage";
import { productSchema } from "../validations/productValidation";
import useSelectQueries from "../hooks/useSelectQueries";
import useAddProduct from "../hooks/useAddProduct";
import useUploadFile from "../hooks/useUploadFile";
import { checkLoadingState } from "../../common/helpers/loading";

export default function ProductAdd() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      price: "",
      description: "",
      category_id: "",
      brand_id: "",
      imageFile: null,
    },
    resolver: yupResolver(productSchema),
  });
  const queryClient = useQueryClient();

  // Query category and brand
  const [categoryQuery, brandQuery] = useSelectQueries();

  // Create addProductMutation and uploadFileMutation
  const addProductMutation = useAddProduct({
    onSuccess: () => reset(),
  });
  const uploadFileMutation = useUploadFile();

  // Loading state
  const isLoading = checkLoadingState([categoryQuery, brandQuery]);
  const isProductUploading = checkLoadingState([
    addProductMutation,
    uploadFileMutation,
  ]);

  // Submit form
  async function handleAddProduct(data) {
    const categories = queryClient.getQueryData({
      queryKey: ["categories"],
    }).data;

    const category = categories.find((c) => c.id === Number(data.category_id));

    const { data: file } = await uploadFileMutation.mutateAsync({
      category: category.name,
      file: data.imageFile[0],
    });

    const { data: thumbnail } = supabase.storage
      .from("ecommerce")
      .getPublicUrl(file.path);

    const { imageFile, ...product } = data;

    addProductMutation.mutate({
      ...product,
      thumbnail: thumbnail.publicUrl,
    });
  }

  if (isLoading) return <Loading />;

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(handleAddProduct)}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          mb={4}
          fontWeight={500}
        >
          Add new product
        </Typography>
        {addProductMutation.isSuccess && (
          <Alert severity="success" sx={{ marginBottom: 4 }}>
            <AlertTitle>Success</AlertTitle>
            Added product successfully —{" "}
            <Link to="/products/">check it out!</Link>
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              disabled={isProductUploading}
              {...register("title")}
            />
            {errors.title && (
              <FormErrorMessage>{errors.title.message}</FormErrorMessage>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <NumericFormat
                  customInput={TextField}
                  allowNegative={false}
                  onValueChange={(v) => {
                    onChange(v.floatValue);
                  }}
                  prefix="$"
                  fullWidth
                  label="Price"
                  fixedDecimalScale
                  thousandSeparator
                  inputRef={ref}
                  value={value}
                  onBlur={onBlur}
                  disabled={isProductUploading}
                />
              )}
              name="price"
              control={control}
            />
            {errors.price && (
              <FormErrorMessage>{errors.price.message}</FormErrorMessage>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              multiline
              rows={6}
              fullWidth
              disabled={isProductUploading}
              {...register("description")}
            />
            {errors.description && (
              <FormErrorMessage>{errors.description.message}</FormErrorMessage>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFSelect
              name="category_id"
              label="Category"
              control={control}
              disabled={isProductUploading}
            >
              {categoryQuery.data.map((category) => (
                <MenuItem key={category.name} value={category.id}>
                  {category.description}
                </MenuItem>
              ))}
            </RHFSelect>
            {errors.category_id && (
              <FormErrorMessage>{errors.category_id.message}</FormErrorMessage>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFSelect
              name="brand_id"
              label="Brand"
              control={control}
              disabled={isProductUploading}
            >
              {brandQuery.data.map((brand) => (
                <MenuItem key={brand.name} value={brand.id}>
                  {brand.description}
                </MenuItem>
              ))}
            </RHFSelect>
            {errors.brand_id && (
              <FormErrorMessage>{errors.brand_id.message}</FormErrorMessage>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Button
                variant="contained"
                color="success"
                component="label"
                fullWidth
                disabled={isProductUploading}
              >
                Upload Image
                <input
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                  {...register("imageFile")}
                />
              </Button>
              {watch("imageFile") && (
                <Typography>{watch("imageFile")[0].name}</Typography>
              )}
              {errors.imageFile && (
                <FormErrorMessage>{errors.imageFile.message}</FormErrorMessage>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={isProductUploading}
              startIcon={
                isProductUploading && <CircularProgress color="inherit" />
              }
            >
              {uploadFileMutation.isLoading
                ? "Uploading photo..."
                : addProductMutation.isLoading
                ? "Adding..."
                : "Add"}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
