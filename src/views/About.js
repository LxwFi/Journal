import React from "react";

function AboutSection() {
    return (
        <div>
            <h1 className="text-center">About Section.</h1>
            <br></br>
            <h2 className="text-center">Privacy</h2>
            <p className="text-center">Any information put onto the website is secure and will not be visable to those who are not meant to see it.</p>
            <br></br>
            <h2 className="text-center">About this app</h2>
            <p className="text-center">You can enter stuff into your journal to read later.</p>
        </div>

    )
}

const About = () => (
    <AboutSection />
);

export default About;