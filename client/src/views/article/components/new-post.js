import React from 'react';
import { Box, Grid, TextField} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { Editor } from "@tinymce/tinymce-react";

const Newpost = () => {
  return (
    <PageContainer title="Article" description="This is Article">
      <Box sx={{ padding: { xs: '10px', md: '20px' } }}>
        <Grid container spacing={3}>
          {/* Title Input with no visible input box */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder="Tiêu đề"
              variant="standard"
              InputProps={{
                disableUnderline: true, // Removes the underline
                style: {
                  fontSize: '2rem',  // Adjust the size as needed
                  fontWeight: 'bold',
                },
              }}
              sx={{
                '& .MuiInputBase-root': {
                  padding: 0, // Removes padding around the text
                },
              }}
            />
          </Grid>

          {/* Content Editor */}
          <Grid item xs={12}>
            <Editor
              apiKey="w8d8xdljziohzromzltpcfb782uwno43s83axici5dyzam4y"
              init={{
                height: 500, // Adjust the height as necessary
                menubar: false, // Optional: Hide the menu bar for a cleaner look
                plugins: [
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                  "mediaembed casechange export formatpainter pageembed linkchecker",
                  "a11ychecker tinymcespellchecker permanentpen powerpaste advtable",
                  "advcode editimage advtemplate ai mentions tinycomments tableofcontents",
                  "footnotes mergetags autocorrect typography inlinecss markdown"
                ],
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | link image media table mergetags | removeformat | addcomment showcomments | spellcheckdialog a11ycheck typography",
                tinycomments_mode: "embedded",
                tinycomments_author: "Author name",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                body_class: "my-editor",
                ai_request: (request, respondWith) =>
                  respondWith.string(() =>
                    Promise.reject("See docs to implement AI Assistant")
                  ),
              }}
              // initialValue=""
              // onEditorChange={(content) => setValue("content", content)}
            />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Newpost;
