import React, { useEffect, useState } from "react";
import { Container, Grid, Box, Typography, Button, Avatar, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import adminStore from "../stores/adminStore";
import userStore from "../stores/userStore";
import _ from "lodash";

const AdminListPage = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debounceSearch = _.debounce((query) => {
    setDebouncedQuery(query);
  }, 500);

  useEffect(() => {
    debounceSearch(searchQuery);
    return () => {
      debounceSearch.cancel();
    };
  }, [searchQuery, debounceSearch]);

  useEffect(() => {
    adminStore.fetchAdmins();
    adminStore.fetchUserSubscriptions(userStore.user?.uid);
  }, []);

  const handleSubscribe = async (adminId) => {
    await adminStore.subscribeToAdmin(userStore.user?.uid, adminId);
  };

  const handleUnsubscribe = async (adminId) => {
    await adminStore.unsubscribeFromAdmin(userStore.user?.uid, adminId);
  };

  // ✅ Fixed filter to handle undefined values
  const filteredAdmins = adminStore.admins.filter((admin) => {
    const name = admin.displayName ?? "";
    const email = admin.email ?? "";
    const query = debouncedQuery ?? "";

    return (
      name.toLowerCase().includes(query.toLowerCase()) ||
      email.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("admins_list")}
      </Typography>

      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/")}
        >
          {t("go_to_home")}
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          label={t("search_admins")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search_admins_placeholder")}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredAdmins.map((admin) => {
          const isSubscribed = adminStore.userSubscriptions.includes(admin.uid);

          return (
            <Grid item xs={12} sm={6} md={4} key={admin.uid}>
              <Box
                border={1}
                borderColor="grey.300"
                borderRadius={2}
                padding={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Avatar
                  src={admin.photoURL}
                  alt={admin.displayName ?? ""}
                  sx={{ width: 56, height: 56, mb: 2 }}
                />
                <Typography variant="h6">{admin.displayName ?? ""}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {admin.email ?? ""}
                </Typography>
                {isSubscribed ? (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleUnsubscribe(admin.uid)}
                    sx={{ mt: 2 }}
                  >
                    {t("unsubscribe")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubscribe(admin.uid)}
                    sx={{ mt: 2 }}
                  >
                    {t("subscribe")}
                  </Button>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
});

export default AdminListPage;
