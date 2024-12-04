
import express from 'express';
import {exec} from 'child_process';
import path from 'path';
import os from 'os';
import cors from 'cors';

const app=express();
const PORT=8080;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.get('/',(req,res)=>{
    res.send('hello there');
})

app.post('/download', (req, res) => {
    const url:string= req.body.url;

    if (!url) {
        res.status(400).json({ msg: "URL is required." });
    }
    else{
        const homeDir = os.homedir();
        const output = path.join(homeDir, 'Downloads', '%(title)s.%(ext)s');
        const command = `yt-dlp -f worst -o "${output}" "${url}"`;
    
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).json({
                    msg: "Something went wrong during the download.",
                    error: error.message,
                });
            }
    
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).json({
                    msg: "Warning or error occurred during the download.",
                    error: stderr,
                });
            }
    
            console.log(`stdout: ${stdout}`);
            return res.status(200).json({ msg: "Download completed successfully!" });
        });
    }

});

app.listen(PORT,()=>{
    console.log('started at http://localhost:8080');
})