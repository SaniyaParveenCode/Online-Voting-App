 import './CSS/team.css'
import { useEffect, React, useRef } from 'react';
import ScrollReveal from "scrollreveal";
import { SocialIcon } from 'react-social-icons'
import saniya from './CSS/saniya.jpeg'

const Team = () => {
    const revealRefTop = useRef(null);
    const revealRefLeft = useRef(null);

    useEffect(() => {
        ScrollReveal().reveal(revealRefTop.current, {
            duration: 1000,
            delay: 200,
            distance: '50px',
            origin: 'top',
            easing: 'ease',
            reset: true,
        });
    }, []);

    useEffect(() => {
        ScrollReveal().reveal(revealRefLeft.current, {
            duration: 1000,
            delay: 200,
            distance: '50px',
            origin: 'left',
            easing: 'ease',
            reset: true,
        });
    }, []);

    return (
        <div className="Team">
            <h2 ref={revealRefTop}>Developed by</h2>
            <div className='Team-Content'>
                <div className='Team-Content-Card' ref={revealRefLeft}>
                    <img src={saniya} className='image' alt="Sheikh Saniya Parveen" />
                    <h3>
                    Sheikh Saniya Parveen  <br/>
                     <span>MERN Stack Developer</span>
                    </h3>


                    <p>
                        Passionate Software Developer with a BTech in Computer Science & Engineering. 
                        Skilled in C++, JavaScript, and full-stack development using React.js and Node.js. 
                        Experienced in building real-world projects including online voting systems and web applications. 
                        Actively solving problems on LeetCode and exploring scalable system design.
                    </p>
                    <div className="social-links">
                        <SocialIcon className='SocialIcon' style={{ height: "30px", width: "30px" }}
                            href="https://www.linkedin.com/in/sheikh-saniya-parveen-828678259/"
                            target='_blank' url="www.linkedin.com" />
                        <SocialIcon className='SocialIcon' style={{ height: "30px", width: "30px" }}
                            href="https://github.com/SaniyaParveenCode"
                            target='_blank' url="www.github.com" />
                        <SocialIcon className='SocialIcon' style={{ height: "30px", width: "30px" }}
                            href="https://leetcode.com/u/sheikhsaniya/"
                            target='_blank' url="leetcode.com" />
                        <SocialIcon className='SocialIcon' style={{ height: "30px", width: "30px" }}
                            href="mailto:saniyayusuf433@gmail.com"
                            target='_blank' url="mail.google.com" />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Team;
