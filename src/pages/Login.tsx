import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { authenticate } from "../api";
import { useEffect, useState } from "react";
import { useSignIn } from "react-auth-kit";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
interface IProps {
  isLoginOpen: boolean;
  setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginDialog = ({ isLoginOpen, setIsLoginOpen }: IProps) => {
  const signIn = useSignIn();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    setErrorMessage("");
  }, [isLoginOpen]);

  const validationSchema = yup.object({
    username: yup.string().required().max(50),
    password: yup.string().required().max(50),
  });

  return (
    <Dialog open={isLoginOpen}>
      <DialogTitle>
        Login
        <IconButton
          disableRipple
          onClick={() => {
            setIsLoginOpen(false);
            if (
              pathname.startsWith("/add") ||
              pathname.startsWith("/grocery")
            ) {
              navigate(-1);
            }
          }}
          sx={{ "&:hover": { color: "red" }, float: "right", padding: "0px" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{ username: "", password: "" }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (data: { username: string; password: string }) => {
            const response = await authenticate(data);
            if (
              response?.status === 200 &&
              signIn({
                token: response.data.token,
                expiresIn: response.data.expiresIn,
                tokenType: "Bearer",
                authState: response.data.authUserState,
              })
            ) {
              setIsLoginOpen(false);
              location.reload();
            } else {
              setErrorMessage(response?.data.message);
            }
          }}
        >
          {({ errors, isValid, isSubmitting, dirty }) => (
            <Form>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <Grid item sx={{ marginTop: "10px", width: "100%" }}>
                  <Field
                    name="username"
                    type="input"
                    as={TextField}
                    label="Username"
                    size="small"
                    error={errors.username !== undefined}
                    helperText={errors.username}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="password"
                    type={showPassword ? "input" : "password"}
                    as={TextField}
                    label="Password"
                    size="small"
                    error={errors.password !== undefined}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          onMouseDown={() => {
                            setShowPassword(true);
                          }}
                          onMouseUp={() => {
                            setShowPassword(false);
                          }}
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {errorMessage && (
                  <Grid item xs={12} sx={{ color: "red" }}>
                    {errorMessage}
                  </Grid>
                )}
                <Grid item>
                  <Button
                    variant="contained"
                    disabled={!dirty || !isValid || isSubmitting}
                    type="submit"
                  >
                    Go
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
